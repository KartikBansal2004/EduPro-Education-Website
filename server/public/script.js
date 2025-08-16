console.log("EduPro frontend loaded");

// 🌙 Dark Mode Toggle Logic
const toggleBtn = document.getElementById("toggleDark");
const overlay = document.getElementById("dark-overlay");

toggleBtn.addEventListener("click", () => {
  toggleBtn.style.opacity = 0;
  toggleBtn.style.transform = "scale(0.8)";
  overlay.style.opacity = 1;

  setTimeout(() => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    toggleBtn.style.opacity = 1;
    toggleBtn.style.transform = "scale(1)";
    overlay.style.opacity = 0;
  }, 300);
});

// 🔁 Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal');
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      scrollObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

revealElements.forEach(el => scrollObserver.observe(el));

// 🌐 API Base
const API_BASE = "http://localhost:5000";
const token = localStorage.getItem("token");

// ✅ Chatbot Access Checker
async function checkChatAccess() {
  try {
    await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ message: "__access_check__" }),
    });

    // If access granted
    document.getElementById("chat-container").classList.remove("hidden");
  } catch (err) {
    // Access denied (trial over or not logged in)
    document.getElementById("chat-alert").classList.remove("hidden");
  }
}

// 🧠 Send Chat Message
async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  const chatBox = document.getElementById("chat-messages");
  const userMsg = document.createElement("div");
  userMsg.textContent = `🧑‍💻 You: ${text}`;
  chatBox.appendChild(userMsg);

  input.value = "";

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    const botMsg = document.createElement("div");
    botMsg.textContent = `🤖 Bot: ${data.reply}`;
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    const errorMsg = document.createElement("div");
    errorMsg.textContent = `❌ ${err.message || "Error occurred"}`;
    chatBox.appendChild(errorMsg);
  }
}

// 🚀 Run check on page load
window.onload = checkChatAccess;

