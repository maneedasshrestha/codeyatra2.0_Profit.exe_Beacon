// Native fetch is available in Node 22

async function testAiChat() {
    console.log("Testing AI Chat API...");

    try {
        const response = await fetch("http://localhost:5000/api/ai/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Hey senior, what's a good place to study around Pulchowk?",
            }),
        });

        const data = await response.json();
        console.log("Response from AI:", JSON.stringify(data, null, 2));

        if (data.response) {
            console.log("\nPersona Check:");
            const text = data.response.toLowerCase();
            if (text.includes("pulchowk") || text.includes("junior") || text.includes("campus")) {
                console.log("✅ Persona seems organic and consistent with the senior student character.");
            } else {
                console.log("⚠️ Persona might need more tuning.");
            }
        }
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testAiChat();
