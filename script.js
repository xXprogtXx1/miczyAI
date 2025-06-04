const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");

// Cronologia dei messaggi (ruolo e contenuto)
let chatHistory = [];

// Aggiunge un messaggio alla chat e alla cronologia
function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerText = testo;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  salvaCronologiaChat(); // Salva ogni volta che si aggiunge un messaggio
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

// Gestisce la richiesta al backend con cronologia messaggi
async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input) return;

  // Aggiungo messaggio utente a UI e cronologia
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

// Gestisce l'invio con il tasto Invio
inputField.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

// Toggle modalità scura
toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});

// Salva la cronologia nel localStorage in formato array di messaggi
function salvaCronologiaChat() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Carica la cronologia salvata da localStorage e la mostra in chat
function caricaCronologiaChat() {
  const salvata = localStorage.getItem("chatHistory");
  if (salvata) {
    chatHistory = JSON.parse(salvata);
    // Pulisce chatBox per sicurezza
    chatBox.innerHTML = "";
    chatHistory.forEach(msg => {
      aggiungiMessaggio(msg.content, msg.role === "user" ? "utente" : "ai");
    });
  }
}

// Cancella la cronologia
function cancellaCronologiaChat() {
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
  chatHistory = [];
}

// Carica cronologia all’avvio
window.onload = function () {
  caricaCronologiaChat();
};

// Espone cancellaCronologia per uso HTML
window.cancellaCronologiaChat = cancellaCronologiaChat;
