import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDmlkTaSqUT05zp0cVaCNHrAKQhxE9bi4o");

async function run() {
    console.log("Testing with gemini-1.5-flash...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello!");
        console.log("Flash response:", (await result.response).text());
    } catch (e) {
        console.log("Flash Failed:", e.message);
    }

    console.log("\nTesting with gemini-2.0-flash-exp...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent("Hello!");
        console.log("Flash 2.0 response:", (await result.response).text());
    } catch (e) {
        console.log("Flash 2.0 Failed:", e.message);
    }
}

run();
