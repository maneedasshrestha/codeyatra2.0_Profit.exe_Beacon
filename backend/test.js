import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const response = await model.generateContent("Explain how AI works in a few words");
        console.log(response.response.text());
    } catch (error) {
        console.error("AI Error:", error.message);
    }
}

main();