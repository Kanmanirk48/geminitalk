async function sendPrompt() {
  const prompt = document.getElementById("promptInput").value;
  if (!prompt) return alert("Please enter a prompt.");

  const resDiv = document.getElementById("response");
  resDiv.textContent = "Thinking...";

  const res = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  resDiv.textContent = data.reply;

  speakText(data.reply); // voice reply
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("promptInput").value = transcript;
    sendPrompt();
  };
}
