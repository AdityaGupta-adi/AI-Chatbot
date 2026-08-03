let API_KEY = localStorage.getItem("gemini_api_key") || "";

if (!API_KEY) {
  API_KEY = prompt("Enter your Gemini API Key");
  if (API_KEY) {
    localStorage.setItem("gemini_api_key", API_KEY);
  }
}

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");
const themeBtn = document.getElementById("themeBtn");

const newChatBtn = document.getElementById("newChatBtn");

const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const historyList = document.getElementById("historyList");

const suggestionButtons =
document.querySelectorAll(".suggestion");

let chats =
JSON.parse(localStorage.getItem("chatHistory")) || [];

let darkMode = true;

/* =========================
AUTO RESIZE
========================= */

userInput.addEventListener("input",()=>{

userInput.style.height="55px";

userInput.style.height=userInput.scrollHeight+"px";

});

/* =========================
THEME
========================= */

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("light");

darkMode=!darkMode;

themeBtn.textContent=darkMode?"🌙":"☀️";

});

/* =========================
SUGGESTIONS
========================= */

suggestionButtons.forEach(button=>{

button.addEventListener("click",()=>{

userInput.value=button.innerText;

sendMessage();

});

});

/* =========================
ENTER
========================= */

userInput.addEventListener("keydown",(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();

sendMessage();

}

});
/* =========================
SEND MESSAGE
========================= */

sendBtn.addEventListener("click", sendMessage);

async function sendMessage(){

const text=userInput.value.trim();

if(text==="") return;

addMessage(text,"user");

userInput.value="";

userInput.style.height="55px";

showTyping();

setTimeout(()=>{

removeTyping();

const reply = await askGemini(text);

addMessage(reply,"bot");

saveHistory();

},1000);

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

${text}

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

AI is typing...

</div>

`;

chatBox.appendChild(div);

chatBox.scrollTop=chatBox.scrollHeight;

}

function removeTyping(){

const typing=document.getElementById("typing");

if(typing) typing.remove();

}
function getBotReply(text){

const msg=text.toLowerCase();

if(msg.includes("hello") || msg.includes("hi"))
return "👋 Hello! How can I help you today?";

if(msg.includes("how are you"))
return "😊 I'm doing great. Thanks for asking!";

if(msg.includes("time"))
return "🕒 Current Time: " + new Date().toLocaleTimeString();

if(msg.includes("date"))
return "📅 Today: " + new Date().toLocaleDateString();

if(msg.includes("javascript"))
return "JavaScript is a powerful programming language used for web development.";

if(msg.includes("html"))
return "HTML is the standard markup language used to create web pages.";

if(msg.includes("css"))
return "CSS is used to style and design web pages.";

return "🤖 I understand your message. In V3 we'll connect Gemini AI so I can answer almost any question intelligently.";
}

/* =========================
SAVE HISTORY
========================= */

function saveHistory(){

localStorage.setItem("chatHistory",chatBox.innerHTML);

}

window.onload=()=>{

const saved=localStorage.getItem("chatHistory");

if(saved){

chatBox.innerHTML=saved;

}

chatBox.scrollTop=chatBox.scrollHeight;

};

/* =========================
NEW CHAT
========================= */

newChatBtn.addEventListener("click",()=>{

chatBox.innerHTML=`
<div class="bot-message">
<div class="avatar">🤖</div>
<div class="message">
Hello 👋<br>New chat started.
</div>
</div>
`;

saveHistory();

});

/* =========================
CLEAR HISTORY
========================= */

clearHistoryBtn.addEventListener("click",()=>{

localStorage.removeItem("chatHistory");

chatBox.innerHTML="";

});
/* =========================
COPY CHAT
========================= */

const copyChatBtn = document.getElementById("copyChatBtn");

copyChatBtn.addEventListener("click",()=>{

navigator.clipboard.writeText(chatBox.innerText);

alert("✅ Chat copied successfully!");

});

/* =========================
DOWNLOAD CHAT
========================= */

const downloadChatBtn=document.getElementById("downloadChatBtn");

downloadChatBtn.addEventListener("click",()=>{

const blob=new Blob([chatBox.innerText],{type:"text/plain"});

const link=document.createElement("a");

link.href=URL.createObjectURL(blob);

link.download="AI-Chat.txt";

link.click();

});

/* =========================
TEXT TO SPEECH
========================= */

const readChatBtn=document.getElementById("readChatBtn");

const stopReadBtn=document.getElementById("stopReadBtn");

readChatBtn.addEventListener("click",()=>{

speechSynthesis.cancel();

const speech=new SpeechSynthesisUtterance(chatBox.innerText);

speech.lang="en-US";

speech.rate=1;

speech.pitch=1;

speechSynthesis.speak(speech);

});

stopReadBtn.addEventListener("click",()=>{

speechSynthesis.cancel();

});

/* =========================
VOICE INPUT
========================= */

const voiceBtn=document.getElementById("voiceBtn");

const SpeechRecognition=
window.SpeechRecognition||
window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition=new SpeechRecognition();

recognition.lang="en-US";

recognition.interimResults=false;

recognition.maxAlternatives=1;

voiceBtn.addEventListener("click",()=>{

recognition.start();

});

recognition.onresult=(event)=>{

userInput.value=event.results[0][0].transcript;

sendMessage();

};

}else{

voiceBtn.style.display="none";

}

/* =========================
AUTO SCROLL
========================= */

const observer=new MutationObserver(()=>{

chatBox.scrollTop=chatBox.scrollHeight;

});

observer.observe(chatBox,{
childList:true
});

async function askGemini(promptText){

const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

contents:[
{
parts:[
{
text:promptText
}
]
}
]

})

});

const data = await response.json();

return data.candidates[0].content.parts[0].text;

}
