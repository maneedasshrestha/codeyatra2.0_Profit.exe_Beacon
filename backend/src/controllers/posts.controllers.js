import supabase from "../utils/supabase.js";

// POST /posts
export const createPost = async (req, res) => {
  const { user_id, content, college, semester } = req.body;

  if (!user_id || !content || !college || !semester) {
    return res.status(400).json({ error: "user_id, content, college, and semester are required" });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([{ user_id, content, college, semester }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ post: data });
};

// GET /posts
export const getPosts = async (req, res) => {
  const { college, semester } = req.query;

  let query = supabase
    .from("posts")
    .select(`
      id,
      user_id,
      content,
      college,
      semester,
      created_at,
      upvotes(count)
    `)
    .order("created_at", { ascending: false });

  if (college) query = query.eq("college", college);
  if (semester) query = query.eq("semester", semester);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ posts: data });
};

// POST /posts/:id/upvote
export const upvotePost = async (req, res) => {
  const { id: post_id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  // Check if already upvoted
  const { data: existing } = await supabase
    .from("upvotes")
    .select("id")
    .eq("user_id", user_id)
    .eq("post_id", post_id)
    .maybeSingle();

  if (existing) {
    // Toggle off — remove upvote
    const { error } = await supabase
      .from("upvotes")
      .delete()
      .eq("user_id", user_id)
      .eq("post_id", post_id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Upvote removed" });
  }

  // Add upvote
  const { data, error } = await supabase
    .from("upvotes")
    .insert([{ user_id, post_id }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ upvote: data, message: "Post upvoted" });
};
