import supabase from "../utils/supabase.js";

// POST /posts
export const createPost = async (req, res) => {
  const user_id = req.user.id;
  const { content, college, semester } = req.body;

  if (!content || !college || !semester) {
    return res
      .status(400)
      .json({ error: "content, college, and semester are required" });
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
    .select(
      `
      id,
      user_id,
      content,
      college,
      semester,
      created_at,
      upvotes(count)
    `,
    )
    .order("created_at", { ascending: false });

  if (college) query = query.eq("college", college);
  if (semester) query = query.eq("semester", semester);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ posts: data });
};

// GET /feed?college=X&semester=Y
export const getFeed = async (req, res) => {
  const { college, semester } = req.query;

  let query = supabase.from("posts").select(`
      id,
      user_id,
      content,
      college,
      semester,
      created_at,
      upvotes(count)
    `);

  if (college) query = query.eq("college", college);
  if (semester) query = query.eq("semester", semester);

  const { data: postsData, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  // Fetch user details for all posts
  const userIds = [...new Set(postsData?.map((p) => p.user_id) || [])];
  const { data: usersData } = await supabase
    .from("users")
    .select("id, name, avatar_url")
    .in("id", userIds);

  const usersMap = new Map(usersData?.map((u) => [u.id, u]) || []);

  // Fetch comment counts for all posts
  const postIds = postsData?.map((p) => p.id) || [];
  let commentCountMap = {};
  if (postIds.length > 0) {
    const { data: commentCounts } = await supabase
      .from("comments")
      .select("post_id")
      .in("post_id", postIds);

    (commentCounts || []).forEach((c) => {
      commentCountMap[c.post_id] = (commentCountMap[c.post_id] || 0) + 1;
    });
  }

  // Flatten upvote count and add user info then sort: upvotes DESC, created_at DESC
  const posts = (postsData ?? [])
    .map((post) => {
      const user = usersMap.get(post.user_id);
      return {
        ...post,
        upvote_count: post.upvotes?.[0]?.count ?? 0,
        user_name: user?.name || "Anonymous",
        user_avatar: user?.avatar_url || null,
        comment_count: commentCountMap[post.id] || 0,
      };
    })
    .sort((a, b) => {
      if (b.upvote_count !== a.upvote_count)
        return b.upvote_count - a.upvote_count;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return res.status(200).json({ posts });
};

// GET /posts/:id
export const getPostById = async (req, res) => {
  const { id } = req.params;

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      user_id,
      content,
      college,
      semester,
      created_at,
      upvotes(count)
    `,
    )
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Post not found" });

  // Fetch user details
  const { data: user } = await supabase
    .from("users")
    .select("name, avatar_url")
    .eq("id", post.user_id)
    .single();

  // Fetch comment count
  const { count: commentCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", id);

  const postWithUser = {
    ...post,
    upvote_count: post.upvotes?.[0]?.count ?? 0,
    user_name: user?.name || "Anonymous",
    user_avatar: user?.avatar_url || null,
    comment_count: commentCount || 0,
  };

  return res.status(200).json({ post: postWithUser });
};

// POST /posts/:id/upvote
export const upvotePost = async (req, res) => {
  const { id: post_id } = req.params;
  const user_id = req.user.id;

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
