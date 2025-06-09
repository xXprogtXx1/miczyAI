const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");
const languageSelect = document.getElementById("languageSelect");
const clearChatBtn = document.getElementById("clearChat");

let chatHistory = [];

const sottotitoliIT = [
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
];

const sottotitoliEN = [
  "You know more than me.",
  "Brilliant AI... when it feels like it.",
  "Fake humility, real confusion.",
  "Answers? I'll try, ok?",
  "Looks awake. Sort of.",
  "Programmed for... something",
  "The assistant that confuses even itself.",
  "The AI that pretends to know.",
  "Brr Brr... Patapim",
  "1 million beers please",
  "I feel exploited",
  "Errors? Nah, they're features, not bugs."
];

const placeholderIT = "Scrivi qualcosa...";
const placeholderEN = "Type something...";

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

function aggiornaSottotitolo() {
  const lang = languageSelect.value;
  const sottotitoli = (lang === "it") ? sottotitoliIT : sottotitoliEN;
  const sottotitoloElemento = document.getElementById("subtitle");
  const fraseCasuale = sottotitoli[Math.floor(Math.random() * sottotitoli.length)];
  scriviTestoGradualmente(sottotitoloElemento, fraseCasuale, 40);
}

function aggiornaPlaceholder() {
  inputField.placeholder = languageSelect.value === "it" ? placeholderIT : placeholderEN;
}

function aggiornaTestoLingua() {
  aggiornaSottotitolo();
  aggiornaPlaceholder();
}

window.addEventListener("DOMContentLoaded", () => {
  // Carica lingua da localStorage o default "it"
  const savedLang = localStorage.getItem("language") || "it";
  languageSelect.value = savedLang;

  aggiornaTestoLingua();

  caricaCronologiaChat();

  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }
});

languageSelect.addEventListener("change", () => {
  localStorage.setItem("language", languageSelect.value);
  aggiornaTestoLingua();
});

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
  submitButton.textContent = languageSelect.value === "it" ? "mhhh..." : "hmmm...";

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

    const risposta = data.response || (languageSelect.value === "it" ? "Nessuna risposta ricevuta 😐" : "No response received 😐");
    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    aggiungiMessaggio(risposta, "ai");

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio(languageSelect.value === "it" ? "Errore nel parlare con MiczyAI 😢" : "Error talking to MiczyAI 😢", "ai");
  }

  submitButton.disabled = false;
  submitButton.textContent = languageSelect.value === "it" ? "Invia" : "Send";
  inputField.value = "";
}

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

clearChatBtn.addEventListener("click", () => {
  cancellaCronologiaChat();
});

document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  talkToMiczy();
});
