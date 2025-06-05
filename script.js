const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");

// Frasi sarcastiche per il sottotitolo
const sottotitoli = [
  "Più intelligente di te? Forse del tostapane.",
  "IA brillante... quando ha voglia.",
  "Finta umiltà, vera confusione.",
  "Risposte? Ci provo, ok?",
  "Sembra sveglio. Sembra.",
  "Programmata per... qualcosa.",
  "L'assistente che confonde anche se stesso.",
  "L’IA che fa finta di sapere.",
  "Non rispondo a domande esistenziali.",
  "Errori? Feature, non bug."
];

// Effetto scrittura a macchina con spazi corretti
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

// Imposta sottotitolo all'avvio
window.addEventListener("DOMContentLoaded", () => {
  const sottotitoloElemento = document.getElementById("subtitle");
  const fraseCasuale = sottotitoli[Math.floor(Math.random() * sottotitoli.length)];
  scriviTestoGradualmente(sottotitoloElemento, fraseCasuale, 40);
});

// Cronologia dei messaggi
let chatHistory = [];

// Aggiunge un messaggio alla chat e alla cronologia
function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerText = testo;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  salvaCronologiaChat();
}

// Aggiunge il loader
function aggiungiLoader() {
  const loaderWrapper = document.createElement("div");
  loaderWrapper.className = "msg ai loader-wrapper";
  loaderWrapper.setAttribute("id", "loader");
  loaderWrapper.innerHTML = `
    <div class="loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  `;
  chatBox.appendChild(loaderWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Rimuove il loader
function rimuoviLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

// Gestisce la richiesta al backend con cronologia
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

    const risposta = data.response || "Nessuna risposta ricevuta 😐";
    aggiungiMessaggio(risposta, "ai");
    chatHistory.push({ role: "assistant", content: risposta });

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio("Errore nel parlare con MiczyAI 😢", "ai");
  }

  inputField.value = "";
}

// Invio con Invio
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

// Toggle dark mode + salva
toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", toggleDark.checked);
});

// Salvataggio cronologia
function salvaCronologiaChat() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Caricamento cronologia
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

// All'avvio
window.onload = function () {
  caricaCronologiaChat();

  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }
};

window.cancellaCronologiaChat = cancellaCronologiaChat;
