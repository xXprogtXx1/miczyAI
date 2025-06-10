const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");
const toggleLangBtn = document.getElementById("toggleLang");
const subtitleElement = document.getElementById("subtitle");
const sendBtn = document.getElementById("sendBtn");

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
  "You know better than me.",
  "Brilliant AI... when it feels like it.",
  "Fake humility, real confusion.",
  "Answers? I'll try, okay?",
  "Looks smart. Sort of.",
  "Programmed for... something.",
  "The assistant that confuses even itself.",
  "The AI pretending to know.",
  "Brr Brr.... Patapim",
  "1 million beers please",
  "I feel exploited",
  "Errors? Nah, they're features, not bugs."
];

// Testi placeholder e bottone in IT e EN
const testiUI = {
  it: {
    placeholder: "Scrivi qualcosa...",
    sendButton: "Invia"
  },
  en: {
    placeholder: "Type something...",
    sendButton: "Send"
  }
};

let currentLang = "it";

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

window.addEventListener("DOMContentLoaded", () => {
  aggiornaLinguaUI(currentLang);
  caricaCronologiaChat();
  // Scrivi sottotitolo casuale nella lingua corrente
  const sottotitoli = currentLang === "it" ? sottotitoliIT : sottotitoliEN;
  const fraseCasuale = sottotitoli[Math.floor(Math.random() * sottotitoli.length)];
  scriviTestoGradualmente(subtitleElement, fraseCasuale, 40);

  // Carica modalità scura da localStorage
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }

  // Carica lingua da localStorage
  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    currentLang = savedLang;
    aggiornaLinguaUI(currentLang);
  }
});

// Cambia lingua e aggiorna UI
function aggiornaLinguaUI(lang) {
  currentLang = lang;
  // Aggiorna placeholder input
  inputField.placeholder = testiUI[lang].placeholder;
  // Aggiorna testo bottone invio
  sendBtn.textContent = testiUI[lang].sendButton;
  // Aggiorna pulsante lingua (mostra lingua *opposta* da selezionare)
  toggleLangBtn.textContent = lang === "it" ? "EN" : "IT";

  // Cambia sottotitolo casuale in nuova lingua
  const sottotitoli = lang === "it" ? sottotitoliIT : sottotitoliEN;
  const fraseCasuale = sottotitoli[Math.floor(Math.random() * sottotitoli.length)];
  scriviTestoGradualmente(subtitleElement, fraseCasuale, 40);

  localStorage.setItem("language", lang);
}

toggleLangBtn.addEventListener("click", () => {
  const nuovaLang = currentLang === "it" ? "en" : "it";
  aggiornaLinguaUI(nuovaLang);
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
  submitButton.textContent = currentLang === "it" ? "mhhh..." : "hmm...";

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

    const risposta = data.response || (currentLang === "it" ? "Nessuna risposta ricevuta 😐" : "No response received 😐");
    chatHistory.push({ role: "assistant", content: risposta }); 
    salvaCronologiaChat(); 
    aggiungiMessaggio(risposta, "ai");

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio(currentLang === "it" ? "Errore nel parlare con MiczyAI 😢" : "Error talking to MiczyAI 😢", "ai");
  }

  submitButton.disabled = false;
  submitButton.textContent = testiUI[currentLang].sendButton;
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

window.onload = function () {
  caricaCronologiaChat();
  // modalità scura e lingua ora caricate su DOMContentLoaded
};

window.cancellaCronologiaChat = cancellaCronologiaChat;
