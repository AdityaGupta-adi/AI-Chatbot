let API_KEY = localStorage.getItem("gemini_api_key") || "";

if (!API_KEY) {
    API_KEY = prompt("Enter your Gemini API Key");

    if (API_KEY) {
        localStorage.setItem("gemini_api_key", API_KEY);
    }
}

async function askGemini(promptText) {

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY
                },
                body: JSON.stringify({
                    model: "gemini-3.6-flash",
                    input: promptText
                })
            }
        );

        const data = await response.json();

        console.log("Gemini:", data);

        if (!response.ok) {
            throw new Error(data.error?.message || "API Error");
        }

        if (data.output_text) {
            return data.output_text;
        }

        if (data.steps) {

            for (const step of data.steps) {

                if (step.content) {

                    for (const item of step.content) {

                        if (item.type === "text") {
                            return item.text;
                        }

                    }

                }

            }

        }

        return "❌ No AI response found.";

    } catch (err) {

        console.error(err);

        return "❌ " + err.message;

    }

}
