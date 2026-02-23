import supabase from "./supabase.js";

/**
 * Searches for educational resources like notes, books, and past papers.
 */
export const searchResources = async ({ subject, semester, file_type, search }) => {
    let query = supabase.from("resources").select(`
        id, title, description, file_url, file_type, subject, semester, download_count, upvotes_count
    `);

    if (subject) query = query.ilike("subject", `%${subject}%`);
    if (semester) query = query.eq("semester", parseInt(semester));
    if (file_type) query = query.eq("file_type", file_type);
    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order("upvotes_count", { ascending: false }).limit(5);
    if (error) throw new Error(error.message);
    return data;
};

/**
 * Retrieves recent discussions or posts from the home feed.
 */
export const getRecentDiscussions = async ({ college, semester }) => {
    let query = supabase.from("posts").select(`
        id, content, college, semester, created_at
    `);

    if (college) query = query.eq("college", college);
    if (semester) query = query.eq("semester", parseInt(semester));

    const { data, error } = await query.order("created_at", { ascending: false }).limit(5);
    if (error) throw new Error(error.message);
    return data;
};

/**
 * Searches for items in the marketplace.
 */
export const searchMarketplace = async ({ search, category, min_price, max_price }) => {
    let query = supabase.from("marketplace").select(`
        id, title, description, price, category, condition, image_url
    `);

    if (search) query = query.ilike("title", `%${search}%`);
    if (category) query = query.eq("category", category);
    if (min_price) query = query.gte("price", parseFloat(min_price));
    if (max_price) query = query.lte("price", parseFloat(max_price));

    const { data, error } = await query.order("created_at", { ascending: false }).limit(5);
    if (error) throw new Error(error.message);
    return data;
};

// Define the tool specifications for Gemini
export const tools = [
    {
        functionDeclarations: [
            {
                name: "searchResources",
                description: "Search for educational resources like notes, books, slides, and past papers.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        subject: { type: "STRING", description: "The subject name (e.g., Microprocessor, Mathematics)" },
                        semester: { type: "NUMBER", description: "The semester number (1-8)" },
                        file_type: { type: "STRING", description: "The type of file (notes, book, slides, past_paper, pdf)" },
                        search: { type: "STRING", description: "A search query for title or description" }
                    }
                }
            },
            {
                name: "getRecentDiscussions",
                description: "Get recent discussions and posts from the home feed based on college or semester.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        college: { type: "STRING", description: "The college name" },
                        semester: { type: "NUMBER", description: "The semester number" }
                    }
                }
            },
            {
                name: "searchMarketplace",
                description: "Search for items available in the marketplace like calculators, books, etc.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        search: { type: "STRING", description: "Search query for the item title" },
                        category: { type: "STRING", description: "The category of the item" },
                        min_price: { type: "NUMBER", description: "Minimum price" },
                        max_price: { type: "NUMBER", description: "Maximum price" }
                    }
                }
            }
        ]
    }
];

export const executableTools = {
    searchResources,
    getRecentDiscussions,
    searchMarketplace
};
