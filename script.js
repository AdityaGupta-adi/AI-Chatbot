let chatHistory = [];
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {

    const text = userInput.value.trim();

    if (!text) return;

    addMessage(text, "user");

    userInput.value = "";

    showTyping();

    try {

        chatHistory.push({
    role: "user",
    text: text
});

const reply = await askGemini(chatHistory);

chatHistory.push({
    role: "assistant",
    text: reply
});

        removeTyping();

        addMessage(reply, "bot");

    } catch (err) {

        removeTyping();

        addMessage("❌ " + err.message, "bot");

    }

}

function addMessage(text, type) {

    const div = document.createElement("div");

    div.className = type + "-message";

    div.innerHTML = `
        <div class="avatar">
            ${type === "user" ? "🧑" : "🤖"}
        </div>

        <div class="message">
            ${type === "bot" ? "" : formatMessage(text)}
        </div>
    `;

    chatBox.appendChild(div);
    if(type === "bot"){

    const msg = div.querySelector(".message");

    typeMessage(msg, text);

    }

    chatBox.scrollTop = chatBox.scrollHeight;

}

async function typeMessage(element, text) {

    element.innerHTML = "";

    let i = 0;

    while (i < text.length) {

        element.innerHTML = formatMessage(
            text.substring(0, i + 1)
        );

        await new Promise(resolve =>
            setTimeout(resolve, 15)
        );

        i++;

        chatBox.scrollTop = chatBox.scrollHeight;

    }

}

function showTyping() {

    const div = document.createElement("div");

    div.className = "bot-message";

    div.id = "typing";

    div.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="message">
            AI is typing...
        </div>
    `;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;

}

function removeTyping() {

    const typing = document.getElementById("typing");

    if (typing) typing.remove();

}

function formatMessage(text){

    text = text.replace(
        /\*\*(.*?)\*\*/g,
        "<b>$1</b>"
    );

    text = text.replace(
        /\*(.*?)\*/g,
        "<i>$1</i>"
    );

    text = text.replace(
        /```([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>"
    );

    text = text.replace(
        /\n/g,
        "<br>"
    );

    return text;

}

