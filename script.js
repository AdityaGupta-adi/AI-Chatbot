const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const themeBtn = document.getElementById("themeBtn");
const newChatBtn = document.getElementById("newChatBtn");
const clearBtn = document.getElementById("clearBtn");

const suggestionButtons =
document.querySelectorAll(".suggestion");

let messages = [];

/* =========================
AUTO RESIZE
========================= */

userInput.addEventListener("input",()=>{

userInput.style.height="55px";
userInput.style.height=userInput.scrollHeight+"px";

});

/* =========================
ENTER KEY
========================= */

userInput.addEventListener("keydown",(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();

sendMessage();

}

});

/* =========================
SEND BUTTON
========================= */

sendBtn.addEventListener("click",sendMessage);

/* =========================
SUGGESTIONS
========================= */

suggestionButtons.forEach(btn=>{

btn.onclick=()=>{

userInput.value=btn.innerText;

sendMessage();

};

});

/* =========================
NEW CHAT
========================= */

newChatBtn.onclick=()=>{

messages=[];

chatBox.innerHTML="";

addMessage(
"Hello 👋 I'm your Premium AI Assistant.",
"bot"
);

};

/* =========================
CLEAR CHAT
========================= */

clearBtn.onclick=()=>{

messages=[];

chatBox.innerHTML="";

};
/* =========================
SEND MESSAGE
========================= */

async function sendMessage(){

const text=userInput.value.trim();

if(!text) return;

addMessage(text,"user");

messages.push({
role:"user",
text:text
});

userInput.value="";
userInput.style.height="55px";

showTyping();

const reply = await askGemini(text);

// Typing animation ko kam se kam 700ms dikhane ke liye
await new Promise(resolve => setTimeout(resolve, 700));

const typing=document.getElementById("typing");

if(typing) typing.remove();

await streamMessage(reply);

messages.push({
role:"assistant",
text:reply
});

}

/* =========================
ADD MESSAGE
========================= */

function addMessage(text,type){

const div=document.createElement("div");

div.className=type+"-message";

div.innerHTML=`
<div class="avatar">
${type==="user"?"🧑":"🤖"}
</div>

<div class="message">
${formatMessage(text)}
</div>
`;

chatBox.appendChild(div);

chatBox.scrollTop=chatBox.scrollHeight;

}

/* =========================
TYPING
========================= */

function showTyping(){

const div=document.createElement("div");

div.className="bot-message";

div.id="typing";

div.innerHTML=`
<div class="avatar">🤖</div>
<div class="message">
Thinking...
</div>
`;

chatBox.appendChild(div);

chatBox.scrollTop=chatBox.scrollHeight;

}

function removeTyping(){

const typing=document.getElementById("typing");

if(typing) typing.remove();

}

async function streamMessage(text){

const div=document.createElement("div");

div.className="bot-message";

div.innerHTML=`
<div class="avatar">🤖</div>

<div class="message"></div>

<button class="copyBtn">📋 Copy</button>
`;

chatBox.appendChild(div);

const msg=div.querySelector(".message");

for(let i=0;i<text.length;i++){

msg.innerHTML=formatMessage(text.substring(0,i+1));

chatBox.scrollTop=chatBox.scrollHeight;

await new Promise(r=>setTimeout(r,12));

}

div.querySelector(".copyBtn").onclick=()=>{

navigator.clipboard.writeText(text);

alert("Copied!");

};

}
/* =========================
FORMAT MESSAGE
========================= */

function formatMessage(text){

if(window.marked){

text = marked.parse(text);

}

return text;

}

/* =========================
THEME
========================= */

themeBtn.onclick=()=>{

document.body.classList.toggle("light");

themeBtn.textContent=
document.body.classList.contains("light")
? "☀️"
: "🌙";

};

/* =========================
EXPORT CHAT
========================= */

document.getElementById("exportBtn").onclick=()=>{

const blob=new Blob(
[chatBox.innerText],
{type:"text/plain"}
);

const link=document.createElement("a");

link.href=URL.createObjectURL(blob);

link.download="AI-Chat.txt";

link.click();

};

/* =========================
VOICE INPUT
========================= */

const SpeechRecognition=
window.SpeechRecognition||
window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition=new SpeechRecognition();

recognition.lang="en-US";

document.getElementById("voiceBtn").onclick=()=>{

recognition.start();

};

recognition.onresult=(e)=>{

userInput.value=
e.results[0][0].transcript;

sendMessage();

};

}

/* =========================
WELCOME MESSAGE
========================= */

addMessage(
"👋 Welcome! Ask me anything.",
"bot"
);
