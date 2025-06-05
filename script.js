const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");

// Frasi sarcastiche per il sottotitolo e <title>
const sottotitoli = [
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

// Scrittura a macchina con spazi non collassati
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

// All’avvio: sottotitolo e titolo casuale
window.addEventListener("DOMContentLoaded", () => {
  const sottotitoloElemento = document.getElementById("subtitle");
  const fraseCasuale = sottotitoli[Math.floor(Math.random() * sottotitoli.length)];
  scriviTestoGradualmente(sottotitoloElemento, fraseCasuale, 40);
  document.title = `MiczyAI — ${fraseCasuale}`;
});

// Cronologia messaggi
let chatHistory = [];

// Aggiunta messaggio
function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerText = testo;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  salvaCronologiaChat();
}

// Loader animazione
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

function rimuoviLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

// Invio messaggio al backend
async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input) return;

  // 🔒 Disabilita il pulsante durante l'elaborazione
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
    aggiungiMessaggio(risposta, "ai");
    chatHistory.push({ role: "assistant", content: risposta });

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio("Errore nel parlare con MiczyAI 😢", "ai");
  }

  // ✅ Riabilita il pulsante e ripristina il testo
  submitButton.disabled = false;
  submitButton.textContent = "Invia";
  inputField.value = "";
}

// Invio con Enter
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

// Toggle dark mode + salvataggio
toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", toggleDark.checked);
});

// Salva e carica cronologia
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
