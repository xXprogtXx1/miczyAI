const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");

// Array per mantenere la cronologia in formato {role, content}
let chatHistory = [];

// Aggiunge un messaggio alla chat e aggiorna chatHistory
function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerText = testo;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Aggiorna chatHistory
  if (mittente === "utente") {
    chatHistory.push({ role: "user", content: testo });
  } else if (mittente === "ai") {
    chatHistory.push({ role: "assistant", content: testo });
  }

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

// Gestisce la richiesta al backend inviando tutta la cronologia
async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input) return;

  aggiungiMessaggio(input, "utente");
  aggiungiLoader();

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory })  // qui inviamo tutta la cronologia
    });

    const data = await response.json();
    rimuoviLoader();

    if (data.response) {
      aggiungiMessaggio(data.response, "ai");
    } else {
      aggiungiMessaggio("Nessuna risposta ricevuta 😐", "ai");
    }

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

// Salva la cronologia nel localStorage in formato {role, content}
function salvaCronologiaChat() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Carica la cronologia salvata e la mostra in chatBox
function caricaCronologiaChat() {
  const salvata = localStorage.getItem("chatHistory");
  if (salvata) {
    chatHistory = JSON.parse(salvata);
    chatHistory.forEach(msg => {
      // Trasformiamo il ruolo "user" in "utente" e "assistant" in "ai" per la classe CSS
      const mittente = msg.role === "user" ? "utente" : "ai";
      const msgDiv = document.createElement("div");
      msgDiv.className = `msg ${mittente}`;
      msgDiv.innerText = msg.content;
      chatBox.appendChild(msgDiv);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Cancella la cronologia
function cancellaCronologiaChat() {
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
  chatHistory = [];
}

// Carica cronologia all'avvio
window.onload = function () {
  caricaCronologiaChat();
};

// Espone cancellaCronologia per uso HTML
window.cancellaCronologiaChat = cancellaCronologiaChat;
