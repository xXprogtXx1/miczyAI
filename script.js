const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");
const languageSelect = document.getElementById("languageSelect");
const sottotitoloElemento = document.getElementById("subtitle");

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
    "Brilliant AI... when it wants to be.",
    "Fake humility, real confusion.",
    "Answers? I’ll try, ok?",
    "Seems smart. Seems.",
    "Programmed for... something",
    "The assistant that confuses itself.",
    "The AI pretending to know.",
    "Brr Brr.... Patapim",
    "1 million beers please",
    "I feel exploited",
    "Bugs? Nah, they’re features."
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

function impostaSottotitolo(lang) {
  const frasi = sottotitoli[lang] || sottotitoli.it;
  const fraseCasuale = frasi[Math.floor(Math.random() * frasi.length)];
  scriviTestoGradualmente(sottotitoloElemento, fraseCasuale, 40);
  document.title = lang === "en" ? "MiczyAI - Smart(ish) Chatbot" : "MiczyAI - Chat intelligente... o forse no";
}

window.addEventListener("DOMContentLoaded", () => {
  const langSalvata = localStorage.getItem("lang") || "it";
  languageSelect.value = langSalvata;
  impostaSottotitolo(langSalvata);
});

languageSelect.addEventListener("change", () => {
  const nuovaLingua = languageSelect.value;
  localStorage.setItem("lang", nuovaLingua);
  impostaSottotitolo(nuovaLingua);
});

let chatHistory = [];

function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  if (mittente === "ai") {
    msg.innerHTML = marked.parse(testo);
  } else {
    msg.textContent = testo;
  }
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
  submitButton.textContent = "mhhh...";

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

    const risposta = data.response || "Nessuna risposta ricevuta 😐";
    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    aggiungiMessaggio(risposta, "ai");

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio("Errore nel parlare con MiczyAI 😢", "ai");
  }

  submitButton.disabled = false;
  submitButton.textContent = "Invia";
  inputField.value = "";
}

submitButton.addEventListener("click", talkToMiczy);

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", toggleDark.checked);
});

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

window.onload = function () {
  caricaCronologiaChat();
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }
};

window.cancellaCronologiaChat = cancellaCronologiaChat;
