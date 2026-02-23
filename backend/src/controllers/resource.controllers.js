import { createClient } from "../utils/supabaseClient.js";

// ─────────────────────────────────────────────
// Helper: calculate ranking score
// upvotes (x3) + downloads (x1) + linked posts (x5) + recency bonus
// ─────────────────────────────────────────────
const calculateScore = (resource) => {
  const recencyDays =
    (Date.now() - new Date(resource.created_at).getTime()) /
    (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 30 - recencyDays); // decays to 0 after 30 days

  return (
    resource.upvotes_count * 3 +
    resource.download_count * 1 +
    (resource.linked_posts_count ?? 0) * 5 +
    recencyScore * 0.5
  );
};

// ─────────────────────────────────────────────
// 1. UPLOAD RESOURCE  →  POST /api/resources
// Body (multipart/form-data): title, description, subject, semester, file_type, file
// ─────────────────────────────────────────────
export const uploadResource = async (req, res) => {
  console.log("=== UPLOAD RESOURCE DEBUG ===");
  console.log("Authorization header:", req.headers.authorization);
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  console.log("Has file:", !!req.file);

  const supabase = createClient({ req, res });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("User:", user);
  console.log("Auth error:", authError);

  if (authError || !user)
    return res.status(401).json({ error: "Unauthorized", details: authError });

  const { title, description, subject, semester, file_type } = req.body;
  const file = req.file;

  console.log("Extracted values:");
  console.log("- title:", title);
  console.log("- subject:", subject);
  console.log("- semester:", semester);
  console.log("- file_type:", file_type);
  console.log("- file:", file);

  if (!title || !subject || !semester || !file_type || !file) {
    return res.status(400).json({
      error: "title, subject, semester, file_type and file are all required",
      received: { title, subject, semester, file_type, hasFile: !!file },
    });
  }

  const ALLOWED_TYPES = ["notes", "pdf", "past_paper", "slides", "book"];
  if (!ALLOWED_TYPES.includes(file_type)) {
    return res
      .status(400)
      .json({ error: `file_type must be one of: ${ALLOWED_TYPES.join(", ")}` });
  }

  const semInt = parseInt(semester);
  if (isNaN(semInt) || semInt < 1 || semInt > 8) {
    return res.status(400).json({ error: "semester must be between 1 and 8" });
  }

  // ── Upload file to Supabase Storage ──
  const fileExt = file.originalname.split(".").pop();
  const safeName = title.replace(/\s+/g, "_").toLowerCase();
  const storagePath = `${user.id}/${Date.now()}_${safeName}.${fileExt}`;

  const { error: storageError } = await supabase.storage
    .from("resources")
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (storageError) {
    console.error("Storage upload error:", storageError);
    return res.status(500).json({ error: "Failed to upload file to storage" });
  }

  const { data: urlData } = supabase.storage
    .from("resources")
    .getPublicUrl(storagePath);

  // ── Insert resource record ──
  const { data: resource, error: dbError } = await supabase
    .from("resources")
    .insert({
      title,
      description: description || null,
      file_url: urlData.publicUrl,
      file_type,
      subject: subject.trim().toLowerCase(),
      semester: semInt,
      uploaded_by: user.id,
    })
    .select(
      `
      *,
      uploader:users(id, email)
    `,
    )
    .single();

  if (dbError) {
    console.error("DB insert error:", dbError);
    return res.status(500).json({ error: "Failed to save resource metadata" });
  }

  res.status(201).json({ message: "Resource uploaded successfully", resource });
};

// ─────────────────────────────────────────────
// 2. GET ALL RESOURCES  →  GET /api/resources
// Query params: type, subject, semester, search, sort, page, limit
// sort options: ranked (default) | newest | most_downloaded | most_upvoted
// ─────────────────────────────────────────────
export const getAllResources = async (req, res) => {
  const supabase = createClient({ req, res });

  const {
    type,
    subject,
    semester,
    search,
    sort = "ranked",
    page = 1,
    limit = 20,
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  let query = supabase.from("resources").select(
    `
      *,
      uploader:users(id, email),
      linked_posts:post_resources(
        post:posts(id, content)
      )
    `,
    { count: "exact" },
  );

  // ── Filters ──
  if (type) query = query.eq("file_type", type);
  if (subject) query = query.ilike("subject", `%${subject.toLowerCase()}%`);
  if (semester) query = query.eq("semester", parseInt(semester));
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,subject.ilike.%${search}%`,
    );
  }

  // Fetch newest first by default; ranked re-sorts in JS
  switch (sort) {
    case "most_downloaded":
      query = query.order("download_count", { ascending: false });
      break;
    case "most_upvoted":
      query = query.order("upvotes_count", { ascending: false });
      break;
    case "newest":
    case "ranked":
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + parseInt(limit) - 1);

  const { data: resources, error, count } = await query;

  if (error) {
    console.error("Fetch resources error:", error);
    return res.status(500).json({ error: "Failed to fetch resources" });
  }

  let enriched = resources.map((r) => ({
    ...r,
    linked_posts_count: r.linked_posts?.length ?? 0,
    score: calculateScore({
      ...r,
      linked_posts_count: r.linked_posts?.length ?? 0,
    }),
  }));

  if (sort === "ranked") {
    enriched = enriched.sort((a, b) => b.score - a.score);
  }

  res.json({
    resources: enriched,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  });
};

// ─────────────────────────────────────────────
// 3. GET SINGLE RESOURCE  →  GET /api/resources/:id
// Also increments download_count
// ─────────────────────────────────────────────
export const getResourceById = async (req, res) => {
  const supabase = createClient({ req, res });
  const { id } = req.params;

  const { data: resource, error } = await supabase
    .from("resources")
    .select(
      `
      *,
      uploader:users(id, email),
      linked_posts:post_resources(
        post:posts(id, content, created_at)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !resource)
    return res.status(404).json({ error: "Resource not found" });

  // Increment download count
  await supabase
    .from("resources")
    .update({ download_count: resource.download_count + 1 })
    .eq("id", id);

  res.json({
    resource: { ...resource, download_count: resource.download_count + 1 },
  });
};

// ─────────────────────────────────────────────
// 4. UPVOTE / UN-UPVOTE  →  POST /api/resources/:id/upvote
// ─────────────────────────────────────────────
export const toggleUpvote = async (req, res) => {
  const supabase = createClient({ req, res });
  const { id } = req.params;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user)
    return res.status(401).json({ error: "Unauthorized" });

  // Check for existing upvote
  const { data: existing } = await supabase
    .from("resource_upvotes")
    .select("id")
    .eq("resource_id", id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // Remove upvote
    await supabase.from("resource_upvotes").delete().eq("id", existing.id);
    await supabase.rpc("decrement_resource_upvotes", { resource_id: id });
    return res.json({ message: "Upvote removed", upvoted: false });
  }

  // Add upvote
  const { error: insertError } = await supabase
    .from("resource_upvotes")
    .insert({ resource_id: id, user_id: user.id });

  if (insertError)
    return res.status(500).json({ error: "Failed to upvote resource" });

  await supabase.rpc("increment_resource_upvotes", { resource_id: id });

  res.json({ message: "Upvoted successfully", upvoted: true });
};

// ─────────────────────────────────────────────
// 5. DELETE RESOURCE  →  DELETE /api/resources/:id
// Only the uploader can delete their resource
// ─────────────────────────────────────────────
export const deleteResource = async (req, res) => {
  const supabase = createClient({ req, res });
  const { id } = req.params;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user)
    return res.status(401).json({ error: "Unauthorized" });

  const { data: resource } = await supabase
    .from("resources")
    .select("id, uploaded_by, file_url")
    .eq("id", id)
    .single();

  if (!resource) return res.status(404).json({ error: "Resource not found" });
  if (resource.uploaded_by !== user.id)
    return res.status(403).json({ error: "Forbidden: not your resource" });

  // Remove file from storage
  const filePath = resource.file_url.split("/resources/")[1];
  if (filePath) {
    await supabase.storage.from("resources").remove([filePath]);
  }

  await supabase.from("resources").delete().eq("id", id);

  res.json({ message: "Resource deleted successfully" });
};
