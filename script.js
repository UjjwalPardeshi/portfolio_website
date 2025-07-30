document.addEventListener("DOMContentLoaded", function () {
    const ws = new WebSocket("wss://portfoliowebsite-production-1cb0.up.railway.app/ws/chat");
    const chatWindow = document.getElementById("chat-window");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    function appendMessage(text, sender) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.classList.add(sender === "user" ? "user" : "bot");
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    sendBtn.onclick = function () {
        const message = chatInput.value.trim();
        if (!message) return;
        appendMessage(message, "user");
        ws.send(message);
        chatInput.value = "";
    };

    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendBtn.onclick();
    });

    ws.onmessage = (ev) => appendMessage(ev.data, "bot");
});
