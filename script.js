console.log("Portfolio site is ready!");

document.addEventListener("DOMContentLoaded", function () {
    // Replace the URL below with your Railway public WebSocket endpoint!
    const ws = new WebSocket("wss://portfoliowebsite-production-1cb0.up.railway.app/ws/chat");

    const chatWindow = document.getElementById("chat-window");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    function appendMessage(sender, text) {
        const msg = document.createElement("div");
        msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatWindow.appendChild(msg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    sendBtn.onclick = function () {
        const message = chatInput.value.trim();
        if (!message) return;
        appendMessage("You", message);
        ws.send(message);
        chatInput.value = "";
    };

    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendBtn.onclick();
    });

    ws.onopen = () => appendMessage("System", "Chatbot connected!");
    ws.onmessage = (ev) => appendMessage("Bot", ev.data);
    ws.onclose = () => appendMessage("System", "Chatbot disconnected.");
});
