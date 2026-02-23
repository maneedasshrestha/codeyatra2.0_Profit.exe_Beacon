import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const prompt = "Say hello as a senior student from Pulchowk College.";

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(response.text());
    } catch (error) {
        console.error("Gemini Error:", error);
    }
}

run();
