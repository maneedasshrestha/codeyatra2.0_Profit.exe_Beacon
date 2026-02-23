import supabase from "../utils/supabase.js";

// POST /api/comments/:postId
export const createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const user_id = req.user.id;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "Comment content is required" });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id, content: content.trim() })
    .select()
    .single();

  if (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({ error: error.message });
  }

  // Fetch user info to return with the comment
  const { data: user } = await supabase
    .from("users")
    .select("name, avatar_url")
    .eq("id", user_id)
    .single();

  return res.status(201).json({
    comment: {
      ...data,
      user_name: user?.name || "Anonymous",
      user_avatar: user?.avatar_url || null,
    },
  });
};

// GET /api/comments/:postId
export const getComments = async (req, res) => {
  const { postId } = req.params;

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({ error: error.message });
  }

  // Fetch user details for all commenters
  const userIds = [...new Set(comments.map((c) => c.user_id))];

  if (userIds.length === 0) {
    return res.json({ comments: [] });
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, name, avatar_url")
    .in("id", userIds);

  const userMap = new Map(users?.map((u) => [u.id, u]) || []);

  const commentsWithUsers = comments.map((c) => {
    const user = userMap.get(c.user_id);
    return {
      ...c,
      user_name: user?.name || "Anonymous",
      user_avatar: user?.avatar_url || null,
    };
  });

  return res.json({ comments: commentsWithUsers });
};

// DELETE /api/comments/:commentId
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const user_id = req.user.id;

  // Check ownership
  const { data: comment } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  if (comment.user_id !== user_id) {
    return res
      .status(403)
      .json({ error: "You can only delete your own comments" });
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json({ message: "Comment deleted" });
};
