import supabase from "../utils/supabase.js";
import multer from "multer";

// Multer config - store in memory buffer
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Helper: Upload image to Supabase bucket
const uploadImageToBucket = async (file) => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `listings/${fileName}`;

  const { error } = await supabase.storage
    .from("marketplace")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from("marketplace")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// POST /api/marketplace
export const createListing = async (req, res) => {
  const { title, description, price, category, condition, college } = req.body;
  // user_id is taken from the authenticated user, not the request body
  const user_id = req.user?.id;

  if (!user_id || !title || !price) {
    return res.status(400).json({ error: "title and price are required" });
  }

  let image_url = null;

  if (req.file) {
    try {
      image_url = await uploadImageToBucket(req.file);
    } catch (err) {
      return res.status(500).json({ error: "Image upload failed: " + err.message });
    }
  }

  const { data, error } = await supabase
    .from("marketplace")
    .insert([{ user_id, title, description, price, category, condition, image_url, college }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ listing: data });
};

// GET /api/marketplace
export const getAllListings = async (req, res) => {
  const { college, category, condition, min_price, max_price, search } = req.query;

  let query = supabase
    .from("marketplace")
    .select(`
      id,
      user_id,
      title,
      description,
      price,
      category,
      condition,
      image_url,
      college,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (college) query = query.eq("college", college);
  if (category) query = query.eq("category", category);
  if (condition) query = query.eq("condition", condition);
  if (min_price) query = query.gte("price", Number(min_price));
  if (max_price) query = query.lte("price", Number(max_price));
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  // Enrich listings with seller names from the users table
  const userIds = [...new Set((data || []).map((l) => l.user_id).filter(Boolean))];
  let sellerMap = {};
  if (userIds.length > 0) {
    const { data: users } = await supabase
      .from("users")
      .select("id, name")
      .in("id", userIds);
    (users || []).forEach((u) => { sellerMap[u.id] = u.name; });
  }

  const listings = (data || []).map((l) => ({
    ...l,
    seller_name: sellerMap[l.user_id] || null,
  }));

  return res.status(200).json({ listings });
};

// DELETE /api/marketplace/:id — only the listing owner can delete
export const deleteListing = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Fetch the listing first to verify ownership
  const { data: listing, error: fetchError } = await supabase
    .from("marketplace")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (fetchError || !listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  if (listing.user_id !== user_id) {
    return res.status(403).json({ error: "Forbidden: you can only delete your own listings" });
  }

  const { error: deleteError } = await supabase
    .from("marketplace")
    .delete()
    .eq("id", id);

  if (deleteError) return res.status(500).json({ error: deleteError.message });

  return res.status(200).json({ message: "Listing deleted" });
};

// GET /api/marketplace/:id
export const getListingById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("marketplace")
    .select(`
      id,
      user_id,
      title,
      description,
      price,
      category,
      condition,
      image_url,
      college,
      created_at
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return res.status(404).json({ error: "Listing not found" });
    }
    return res.status(500).json({ error: error.message });
  }

  // Enrich with seller name
  let seller_name = null;
  if (data?.user_id) {
    const { data: user } = await supabase
      .from("users")
      .select("name")
      .eq("id", data.user_id)
      .single();
    seller_name = user?.name ?? null;
  }

  return res.status(200).json({ listing: { ...data, seller_name } });
};
