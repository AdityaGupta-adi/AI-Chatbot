let API_KEY = localStorage.getItem("gemini_api_key") || "";

if (!API_KEY) {
    API_KEY = prompt("Enter your Gemini API Key");
    if (API_KEY) {
        localStorage.setItem("gemini_api_key", API_KEY);
    }
}

async function askGemini(promptText) {

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
    alert(JSON.stringify(data, null, 2));

    console.log("Gemini Response:", data);

    if (!response.ok) {
        throw new Error(data.error?.message || "API Error");
    }

    if (
    data.steps &&
    data.steps.length > 0 &&
    data.steps[0].content &&
    data.steps[0].content.length > 0
){
    const textItem = data.steps[0].content.find(item => item.type === "text");

if (textItem) {
    return textItem.text;
}

return "❌ No text found.";
}

if (data.output_text) {
    return data.output_text;
}

return "❌ No response received.";
}
