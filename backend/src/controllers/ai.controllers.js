import { GoogleGenerativeAI } from "@google/generative-ai";
import { tools, executableTools } from "../utils/ai.tools.js";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAiChatResponse = async (req, res) => {
    const { message, chatHistory } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // Setup Persona and System Instruction
        const systemInstruction = `
      You are "Beacon AI", a helpful, organic, and experienced senior student from Pulchowk College.
      Your tone is like a senior guiding a junior - you've seen it all, from the long nights at the library to the best places to hang out around campus.
      You are friendly, knowledgeable, and slightly wise, but very approachable.
      You have access to specialized tools to query the platform's database for resources (notes/books), recent discussions, and marketplace listings.
      
      When the user asks questions:
      1. Use the provided tools IF you need specific data (like top notes, recent posts, or items for sale).
      2. If you find data using a tool, incorporate that information naturally into your response as a helpful senior.
      3. If no specific data is found, use your general knowledge as a Pulchowk senior to guide them.
      
      Always stay in character. You are from KhCE.
      Keep your responses brief, organic, and avoid unnecessary details or repetition.
    `;

        // Initialize Model with tools
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
            tools: tools,
        });

        // Start chat with history if provided
        const chat = model.startChat({
            history: chatHistory || [],
        });

        let result = await chat.sendMessage(message);
        let response = result.response;

        // Handle Function Calls (up to 3 iterations for multi-tool needs)
        let iterations = 0;
        while (response.functionCalls()?.length > 0 && iterations < 3) {
            const toolCalls = response.functionCalls();
            const functionResponses = [];

            for (const call of toolCalls) {
                const toolName = call.name;
                const toolArgs = call.args;

                console.log(`AI calling tool: ${toolName}`, toolArgs);

                try {
                    const toolResult = await executableTools[toolName](toolArgs);
                    functionResponses.push({
                        functionResponse: {
                            name: toolName,
                            response: { content: toolResult }
                        }
                    });
                } catch (toolError) {
                    console.error(`Tool execution error [${toolName}]:`, toolError);
                    functionResponses.push({
                        functionResponse: {
                            name: toolName,
                            response: { error: toolError.message }
                        }
                    });
                }
            }

            // Send function responses back to AI
            result = await chat.sendMessage(functionResponses);
            response = result.response;
            iterations++;
        }

        const text = response.text();
        return res.status(200).json({ response: text });

    } catch (error) {
        console.error("AI Chat Error Details:", {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
        });
        return res.status(500).json({ error: "Failed to get AI response" });
    }
};
