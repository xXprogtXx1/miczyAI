const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const chatForm = document.getElementById("chatForm");
const clearBtn = document.getElementById("clearBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const subtitle = document.getElementById("subtitle");

const subtitleText = "La tua intelligenza artificiale personale";
let subtitleIndex = 0;
function typeSubtitle() {
  if (subtitleIndex < subtitleText.length) {
    subtitle.textContent += subtitleText.charAt(subtitleIndex);
    subtitleIndex++;
    setTimeout(typeSubtitle, 80);
  }
}
typeSubtitle();

// Caricamento cronologia e dark mode dallo storage
window.onload = () => {
  const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  savedMessages.forEach(msg => aggiungiMessaggio(msg.testo, msg.tipo));

  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }
};

function salvaCronologia() {
  const messaggi = Array.from(chatBox.getElementsByClassName("msg")).map(msg => ({
    testo: msg.innerHTML,
    tipo: msg.classList.contains("utente") ? "utente" : "ai"
  }));
  localStorage.setItem("chatMessages", JSON.stringify(messaggi));
}

function aggiungiMessaggio(testo, tipo) {
  const msg = document.createElement("div");
  msg.classList.add("msg", tipo);
  msg.innerHTML = marked.parse(testo);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  msg.querySelectorAll("pre code").forEach(block => {
    hljs.highlightElement(block);
  });

  msg.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.innerText = '📋';
    btn.classList.add('copy-btn');
    btn.title = 'Copia codice';
    btn.style.position = 'absolute';
    btn.style.top = '8px';
    btn.style.right = '8px';
    btn.style.padding = '4px 8px';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.background = '#eee';
    btn.style.cursor = 'pointer';

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    wrapper.appendChild(btn);

    btn.addEventListener('click', () => {
      const code = pre.innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.innerText = '✅';
        setTimeout(() => (btn.innerText = '📋'), 1500);
      });
    });
  });

  salvaCronologia();
}

chatForm.addEventListener("submit", async e => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;
  aggiungiMessaggio(input, "utente");
  userInput.value = "";

  const loader = document.createElement("div");
  loader.className = "msg ai";
  loader.innerHTML = '<div class="loader"><div></div><div></div><div></div></div>';
  chatBox.appendChild(loader);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });
    const data = await res.json();
    loader.remove();
    aggiungiMessaggio(data.response, "ai");
  } catch (err) {
    loader.remove();
    aggiungiMessaggio("Errore nella risposta. Riprova più tardi.", "ai");
  }
});

clearBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  localStorage.removeItem("chatMessages");
});

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", darkModeToggle.checked);
  salvaCronologia();
});
