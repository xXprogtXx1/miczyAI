const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");

// Sottotitoli IT/EN
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
    "Errori? Nah sono feature, non bug."
  ],
  en: [
    "You know more than I do.",
    "Brilliant AI... when it wants to be.",
    "Fake humility, real confusion.",
    "Answers? I'll try, ok?",
    "Looks smart. Looks.",
    "Programmed for... something.",
    "The assistant that confuses even itself.",
    "The AI that pretends to know.",
    "Brr Brr.... Patapim",
    "Mistakes? Nah, they’re features."
  ]
};

let currentLang = "it"; // lingua iniziale

// Effetto macchina da scrivere
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

// Aggiorna testo del sito in base alla lingua
function aggiornaLingua(lang) {
  const texts = {
    it: {
      title: "MiczyAI - Chat intelligente... o forse no",
      subtitle: sottotitoli.it[Math.floor(Math.random() * sottotitoli.it.length)],
      placeholder: "Scrivi qualcosa...",
      send: "Invia",
      error: "Errore nel parlare con MiczyAI 😢",
      noResponse: "Nessuna risposta ricevuta 😐",
      toggle: "EN"
    },
    en: {
      title: "MiczyAI - Smart chat... or maybe not",
      subtitle: sottotitoli.en[Math.floor(Math.random() * sottotitoli.en.length)],
      placeholder: "Type something...",
      send: "Send",
      error: "Error talking to MiczyAI 😢",
      noResponse: "No response received 😐",
      toggle: "IT"
    }
  };

  document.title = texts[lang].title; // ← AGGIUNTA QUI
  scriviTestoGradualmente(document.getElementById("subtitle"), texts[lang].subtitle, 40);
  inputField.placeholder = texts[lang].placeholder;
  document.querySelector("button[type='submit']").innerText = texts[lang].send;
  document.getElementById("languageToggle").innerText = texts[lang].toggle;
  inputField.dataset.noResponse = texts[lang].noResponse;
  inputField.dataset.error = texts[lang].error;
  currentLang = lang;
}

// Cambio lingua cliccando sul pulsante
document.getElementById("languageToggle").addEventListener("click", () => {
  const nextLang = currentLang === "it" ? "en" : "it";
  aggiornaLingua(nextLang);
});

// Cronologia dei messaggi
let chatHistory = [];

// Aggiunge un messaggio nella chat
function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerText = testo;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  salvaCronologiaChat();
}

// Loader animato
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

// Funzione di invio richiesta al backend
async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input) return;

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

    const risposta = data.response || inputField.dataset.noResponse;
    aggiungiMessaggio(risposta, "ai");
    chatHistory.push({ role: "assistant", content: risposta });

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio(inputField.dataset.error, "ai");
  }

  inputField.value = "";
}

// Invio con tasto Enter
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

// Dark mode toggle
toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", toggleDark.checked);
});

// Salvataggio e caricamento cronologia
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

// Cancella cronologia
function cancellaCronologiaChat() {
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
  chatHistory = [];
}

// All’avvio
window.onload = function () {
  caricaCronologiaChat();

  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }

  aggiornaLingua(currentLang); // inizializza testo
};

window.cancellaCronologiaChat = cancellaCronologiaChat;
