const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");
const subtitleElement = document.getElementById("subtitle");
const toggleLang = document.getElementById("toggleLang");
const sendBtn = document.getElementById("sendBtn");

let lingua = localStorage.getItem("lang") || "it";

const sottotitoli = {
  it: [
    "Sai più tu che io.",
    "IA brillante... quando ha voglia.",
    "Finta umiltà, vera confusione.",
    "Risposte? Ci provo, ok?",
    "Sembra sveglio. Sembra.",
    "Programmata per... qualcosa",
    "L'assistente che confonde anche se stesso.",
    "L’IA che fa finta di sapere.",
    "Brr Brr.... Patapim",
    "1 million beers please",
    "Mi sento sfruttato",
    "Errori? Nah sono feature, non bug."
  ],
  en: [
    "You know more than I do.",
    "Brilliant AI... when it feels like it.",
    "Fake humility, real confusion.",
    "Answers? I'll try, ok?",
    "Seems smart. Just seems.",
    "Programmed for... something",
    "The assistant that confuses even itself.",
    "The AI that pretends to know.",
    "Brr Brr... Patapim",
    "1 million beers please",
    "I feel exploited",
    "Errors? Nah, they’re features, not bugs."
  ]
};

function scriviTestoGradualmente(elemento, testo, velocita = 50) {
  elemento.innerHTML = "";
  let i = 0;
  function scrivi() {
    if (i < testo.length) {
      const char = testo[i] === " " ? "&nbsp;" : testo[i];
      elemento.innerHTML += char;
      i++;
      setTimeout(scrivi, velocita);
    }
  }
  scrivi();
}

function mostraSottotitolo() {
  const fraseCasuale = sottotitoli[lingua][Math.floor(Math.random() * sottotitoli[lingua].length)];
  scriviTestoGradualmente(subtitleElement, fraseCasuale, 40);
}

window.addEventListener("DOMContentLoaded", () => {
  mostraSottotitolo();
});

let chatHistory = [];

function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerHTML = mittente === "ai" ? marked.parse(testo) : testo;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  salvaCronologiaChat();
}

function aggiungiLoader() {
  const loaderWrapper = document.createElement("div");
  loaderWrapper.className = "msg ai loader-wrapper";
  loaderWrapper.setAttribute("id", "loader");
  loaderWrapper.innerHTML = `
    <div class="loader">
      <div></div><div></div><div></div>
    </div>
  `;
  chatBox.appendChild(loaderWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function rimuoviLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input) return;

  submitButton.disabled = true;
  submitButton.textContent = lingua === "it" ? "mhhh..." : "hmmm...";

  aggiungiMessaggio(input, "utente");
  chatHistory.push({ role: "user", content: input });
  aggiungiLoader();

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory })
    });

    const data = await response.json();
    rimuoviLoader();

    const risposta = data.response || (lingua === "it" ? "Nessuna risposta ricevuta 😐" : "No response received 😐");
    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    aggiungiMessaggio(risposta, "ai");

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio(lingua === "it" ? "Errore nel parlare con MiczyAI 😢" : "Error talking to MiczyAI 😢", "ai");
  }

  submitButton.disabled = false;
  submitButton.textContent = lingua === "it" ? "Invia" : "Send";
  inputField.value = "";
}

inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

toggleDark.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", toggleDark.checked);
});

toggleLang.addEventListener("click", () => {
  lingua = lingua === "it" ? "en" : "it";
  localStorage.setItem("lang", lingua);
  aggiornaLinguaUI();
});

function aggiornaLinguaUI() {
  toggleLang.textContent = lingua.toUpperCase();
  inputField.placeholder = lingua === "it" ? "Scrivi qualcosa..." : "Type something...";
  sendBtn.textContent = lingua === "it" ? "Invia" : "Send";
  mostraSottotitolo();
}

function salvaCronologiaChat() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function caricaCronologiaChat() {
  const salvata = localStorage.getItem("chatHistory");
  if (salvata) {
    chatHistory = JSON.parse(salvata);
    chatBox.innerHTML = "";
    chatHistory.forEach(msg => {
      aggiungiMessaggio(msg.content, msg.role === "user" ? "utente" : "ai");
    });
  }
}

function cancellaCronologiaChat() {
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
  chatHistory = [];
}

window.onload = () => {
  caricaCronologiaChat();
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }
  aggiornaLinguaUI();
};

window.cancellaCronologiaChat = cancellaCronologiaChat;
