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

        console.log(data);

        if (!response.ok) {
            throw new Error(
                data.error?.message || "Unknown API Error"
            );
        }

        return data.output_text;

    } catch (error) {

        console.error(error);

        return "❌ " + error.message;

    }

}
