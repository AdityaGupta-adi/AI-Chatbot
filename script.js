// ===============================
// AI Chatbot V5 Premium
// Core Setup
// ===============================
let selectedImage = null;

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

const themeBtn = document.getElementById("themeBtn");
const exportBtn = document.getElementById("exportBtn");

const newChatBtn = document.getElementById("newChatBtn");
const clearBtn = document.getElementById("clearBtn");

const searchChat = document.getElementById("searchChat");

const historyList = document.getElementById("historyList");

const suggestions =
document.querySelectorAll(".suggestion");

let chatHistory = [];

let typingSpeed = 15;

let darkMode = true;

let speaking = false;
userInput.addEventListener("input",()=>{

userInput.style.height="55px";

userInput.style.height=
userInput.scrollHeight+"px";

});
userInput.addEventListener("keydown",(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();

sendMessage();

}

});
suggestions.forEach(btn=>{

btn.onclick=()=>{

userInput.value=btn.innerText;

sendMessage();

};

});
sendBtn.onclick=sendMessage;

newChatBtn.onclick=newChat;

clearBtn.onclick=clearChat;
// ===============================
// SEND MESSAGE
// ===============================

async function sendMessage(){

const text=userInput.value.trim();

if(text==="") return;

addMessage(text,"user");

chatHistory.push({

role:"user",

text:text

});

userInput.value="";

userInput.style.height="55px";

showTyping();

try{

const reply = await askGemini(chatHistory);

removeTyping();

await streamMessage(reply);

chatHistory.push({

role:"assistant",

text:reply

});

saveChat();

}catch(err){

removeTyping();

addMessage(

"❌ "+err.message,

"bot"

);

console.error(err);

}

}
// ===============================
// ADD MESSAGE
// ===============================

function addMessage(text,type){

const div=document.createElement("div");

div.className=

type==="user"

?

"userMessage"

:

"botMessage";

div.innerHTML=`

<div class="avatar">

${type==="user"?"🧑":"🤖"}

</div>

<div class="message">

${formatMessage(text)}

</div>

`;

chatBox.appendChild(div);

chatBox.scrollTop=

chatBox.scrollHeight;

}
// ===============================
// AUTO SCROLL
// ===============================

function scrollBottom(){

chatBox.scrollTop=

chatBox.scrollHeight;

}
// ===============================
// SHOW TYPING
// ===============================

function showTyping(){

const div=document.createElement("div");

div.className="botMessage";

div.id="typing";

div.innerHTML=`

<div class="avatar">🤖</div>

<div class="message">

<div class="typingDots">

<span></span>

<span></span>

<span></span>

</div>

</div>

`;

chatBox.appendChild(div);

scrollBottom();

}

// ===============================
// REMOVE TYPING
// ===============================

function removeTyping(){

const typing=document.getElementById("typing");

if(typing){

typing.remove();

}

}
// ===============================
// STREAM MESSAGE
// ===============================

async function streamMessage(text){

const div=document.createElement("div");

div.className="botMessage";

div.innerHTML=`

<div class="avatar">🤖</div>

<div class="message"></div>

`;

chatBox.appendChild(div);

const msg=div.querySelector(".message");

for(let i=0;i<text.length;i++){

msg.innerHTML=text.substring(0,i+1);

scrollBottom();

await new Promise(resolve=>

setTimeout(resolve,typingSpeed)

);

}

// Markdown Render

msg.innerHTML=formatMessage(text);

// Syntax Highlight

if(window.Prism){

Prism.highlightAllUnder(msg);

}

// Copy Button

const copy=document.createElement("button");

copy.className="copyBtn";

copy.textContent="📋 Copy";

copy.onclick=()=>{

navigator.clipboard.writeText(text);

copy.textContent="✅ Copied";

setTimeout(()=>{

copy.textContent="📋 Copy";

},2000);

};

div.appendChild(copy);

scrollBottom();

}
// ===============================
// FORMAT MESSAGE
// ===============================

function formatMessage(text){

if(window.marked){

return marked.parse(text);

}

return text;

}
// ===============================
// THEME TOGGLE
// ===============================

themeBtn.onclick=()=>{

darkMode=!darkMode;

document.body.classList.toggle("light");

localStorage.setItem(

"theme",

darkMode?"dark":"light"

);

};

// ===============================
// LOAD THEME
// ===============================

const savedTheme=

localStorage.getItem("theme");

if(savedTheme==="light"){

document.body.classList.add("light");

darkMode=false;

}
// ===============================
// SAVE CHAT
// ===============================

function saveChat(){

localStorage.setItem(

"chatHistory",

JSON.stringify(chatHistory)

);

}

// ===============================
// LOAD CHAT
// ===============================

function loadChat(){

const data=

localStorage.getItem(

"chatHistory"

);

if(!data) return;

chatHistory=

JSON.parse(data);

chatBox.innerHTML="";

chatHistory.forEach(item=>{

addMessage(

item.text,

item.role==="user"

?

"user"

:

"bot"

);

});

scrollBottom();

}

loadChat();
// ===============================
// NEW CHAT
// ===============================

function newChat(){

chatHistory=[];

chatBox.innerHTML="";

saveChat();

addMessage(

"👋 New Chat Started!",

"bot"

);

}

// ===============================
// CLEAR CHAT
// ===============================

function clearChat(){

if(

confirm(

"Clear all chats?"

)

){

newChat();

}

}
// ===============================
// EXPORT CHAT
// ===============================

exportBtn.onclick=()=>{

const text=

chatHistory

.map(

m=>`${m.role}: ${m.text}`

)

.join("\n\n");

const blob=

new Blob(

[text],

{

type:"text/plain"

}

);

const a=

document.createElement("a");

a.href=

URL.createObjectURL(blob);

a.download=

"AI-Chat.txt";

a.click();

};
// ===============================
// VOICE INPUT
// ===============================

if ("webkitSpeechRecognition" in window) {

const recognition = new webkitSpeechRecognition();

recognition.lang = "en-IN";

recognition.continuous = false;

recognition.interimResults = false;

voiceBtn.onclick = () => {

recognition.start();

};

recognition.onresult = (e) => {

userInput.value = e.results[0][0].transcript;

sendMessage();

};

recognition.onerror = () => {

alert("Voice recognition failed.");

};

}
// ===============================
// VOICE OUTPUT
// ===============================

const synth = window.speechSynthesis;

let speaking = false;

document.getElementById("voiceOutputBtn").onclick = () => {

if (chatHistory.length === 0) return;

const last = [...chatHistory]
.reverse()
.find(m => m.role === "assistant");

if (!last) return;

if (speaking) {
    synth.cancel();
    speaking = false;
    return;
}

const utter = new SpeechSynthesisUtterance(last.text);

utter.lang = "en-US";
utter.rate = 1;
utter.pitch = 1;

utter.onstart = () => speaking = true;

utter.onend = () => speaking = false;

synth.speak(utter);

};
// ===============================
// IMAGE PREVIEW
// ===============================

const imageInput = document.getElementById("imageInput");

imageInput.addEventListener("change", (e) => {

const file = e.target.files[0];

if (!file) return;

const reader = new FileReader();

reader.onload = function () {

const div = document.createElement("div");

div.className = "userMessage";

div.innerHTML = `
<div class="avatar">🧑</div>
<div class="message">
<img src="${reader.result}" class="previewImage">
</div>
`;

chatBox.appendChild(div);

scrollBottom();

};

reader.readAsDataURL(file);

});
// ===============================
// FILE UPLOAD
// ===============================

const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (e) => {

const file = e.target.files[0];

if (!file) return;

addMessage(
`📄 File Selected:\n${file.name}`,
"user"
);

});

// ===============================
// IMAGE UPLOAD
// ===============================

let selectedImage = null;

const imageInput = document.getElementById("imageInput");

imageInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

        selectedImage = reader.result;

        const div = document.createElement("div");

        div.className = "userMessage";

        div.innerHTML = `
        <div class="avatar">🧑</div>
        <div class="message">
            <img src="${selectedImage}" class="previewImage">
        </div>
        `;

        chatBox.appendChild(div);

        scrollBottom();

    };

    reader.readAsDataURL(file);

});
