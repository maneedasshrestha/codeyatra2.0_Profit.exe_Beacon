-- ─────────────────────────────────────────────────────────────────────────────
-- BEACON CHAT TABLES
-- Run this in the Supabase SQL Editor (or via supabase db push).
--
-- Schema:
--   conversations  — one row per unique 1-on-1 chat room
--   messages       — individual messages linked to a conversation
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. conversations ─────────────────────────────────────────────────────────
-- The primary key `id` matches the deterministic room string used by the
-- socket server: lower_uuid || '--' || higher_uuid  (sorted lexicographically).

CREATE TABLE IF NOT EXISTS conversations (
  id           TEXT        PRIMARY KEY,            -- e.g. "uuid-a--uuid-b"
  user1_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),  -- bumped on every new message

  -- Prevent duplicate pairs regardless of ordering
  CONSTRAINT conversations_unique_pair UNIQUE (user1_id, user2_id),
  CONSTRAINT conversations_no_self_chat CHECK (user1_id <> user2_id)
);

-- Index for quickly fetching all conversations a user is part of
CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user2_id);

-- ── 2. messages ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id              BIGSERIAL   PRIMARY KEY,
  conversation_id TEXT        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name     TEXT        NOT NULL DEFAULT '',
  text            TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for loading message history for a room (ordered by time)
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at ASC);

-- ── 3. Auto-bump conversations.updated_at on new message ────────────────────

CREATE OR REPLACE FUNCTION bump_conversation_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bump_conversation ON messages;
CREATE TRIGGER trg_bump_conversation
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION bump_conversation_updated_at();

-- ── 4. Row-Level Security ────────────────────────────────────────────────────
-- Users can only see conversations and messages they are part of.
-- The backend uses the SERVICE ROLE key (bypasses RLS), so these policies
-- protect direct client access only.

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;

-- conversations: visible to participants
CREATE POLICY "conversations_select" ON conversations
  FOR SELECT USING (
    auth.uid() = user1_id OR auth.uid() = user2_id
  );

CREATE POLICY "conversations_insert" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = user1_id OR auth.uid() = user2_id
  );

-- messages: visible if user is in the conversation
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );
