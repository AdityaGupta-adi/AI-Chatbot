const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    chatBox.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;

    userInput.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {

        botReply(message);

    }, 700);

}

function botReply(message){

    let reply = "";

    const text = message.toLowerCase();

    if(text.includes("hello") || text.includes("hi")){
        reply = "👋 Hello! How can I help you today?";
    }
    else if(text.includes("how are you")){
        reply = "😊 I'm doing great! Thanks for asking.";
    }
    else if(text.includes("your name")){
        reply = "🤖 I'm your AI Chatbot.";
    }
    else if(text.includes("bye")){
        reply = "👋 Goodbye! Have a great day.";
    }
    else if(text.includes("time")){
        reply = "🕒 Current Time: " + new Date().toLocaleTimeString();
    }
    else if(text.includes("date")){
        reply = "📅 Today is " + new Date().toLocaleDateString();
    }
    else{
        reply = "🤖 Sorry, I don't understand that yet.";
    }

  chatBox.innerHTML += `
        <div class="bot-message">
            ${reply}
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;
}

clearBtn.addEventListener("click", () => {

    chatBox.innerHTML = `
        <div class="bot-message">
            👋 Chat cleared. Ask me anything!
        </div>
    `;

});
/* =========================
   TYPING EFFECT
========================= */

function showTyping() {

    chatBox.innerHTML += `
        <div class="bot-message" id="typing">
            ⌨️ AI is typing...
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {

    const typing = document.getElementById("typing");

    if (typing) {
        typing.remove();
    }

}

/* Override sendMessage with typing animation */

function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    chatBox.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;

    userInput.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    showTyping();

    setTimeout(() => {

        removeTyping();

        botReply(message);

    }, 1000);

}

/* Welcome Message */

window.onload = () => {

    chatBox.scrollTop = chatBox.scrollHeight;

};
