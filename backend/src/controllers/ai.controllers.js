import { GoogleGenerativeAI } from "@google/generative-ai";
import supabase from "../utils/supabase.js";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAiChatResponse = async (req, res) => {
    const { message, chatHistory } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // 1. Fetch context from Home Feed (Posts and potentially Comments)
        // For now, let's fetch the latest 10 posts to keep context window reasonable
        const { data: posts, error: postsError } = await supabase
            .from("posts")
            .select("content, college, semester, created_at")
            .order("created_at", { ascending: false })
            .limit(10);

        if (postsError) {
            console.error("Error fetching posts context:", postsError);
        }

        // Prepare context string
        let contextString = "Context from the Home Feed (Threads & Discussions):\n";
        if (posts && posts.length > 0) {
            posts.forEach((post, index) => {
                contextString += `${index + 1}. [${post.college} - Sem ${post.semester}] Post: ${post.content}\n`;
            });
        } else {
            contextString += "No recent threads available yet.\n";
        }

        // 2. Setup Persona and System Prompt
        const systemPrompt = `
      You are "Beacon AI", a helpful, organic, and experienced senior student from Pulchowk College.
      Your tone is like a senior guiding a junior - you've seen it all, from the long nights at the library to the best places to hang out around campus.
      You are friendly, knowledgeable, and slightly wise, but very approachable.
      You have access to the recent discussions happening in the "Home Feed" of the CodeYatra platform.
      
      ${contextString}
      
      When the user asks questions, use this context if relevant. If they ask about things happening in college, refer to these threads.
      If the context doesn't have the answer, use your general knowledge as a Pulchowk senior to guide them.
      Always stay in character. You are from Pulchowk College.
      Keep your responses brief, organic, and avoid unnecessary details or repetition.
    `;

        // 3. Generate content with Gemini
        let text = "";
        try {
            // Using gemini-2.0-flash-exp or gemini-1.5-flash
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `${systemPrompt}\n\nUser: ${message}\nBeacon AI:`;
            const result = await model.generateContent(prompt);
            text = (await result.response).text();
        } catch (error) {
            console.error("Gemini failed:", error.message);
            throw error; // Re-throw to be caught by outer catch
        }

        return res.status(200).json({ response: text });
    } catch (error) {
        console.error("AI Chat Error Details:", {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            details: error.errorDetails
        });
        return res.status(500).json({ error: "Failed to get AI response" });
    }
};
