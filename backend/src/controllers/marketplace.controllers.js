import supabase from "../utils/supabase.js";

// POST /api/marketplace
export const createListing = async (req, res) => {
  const { user_id, title, description, price, category, condition, image_url, college } = req.body;

  if (!user_id || !title || !price) {
    return res.status(400).json({ error: "user_id, title, and price are required" });
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

  return res.status(200).json({ listings: data });
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

  return res.status(200).json({ listing: data });
};
