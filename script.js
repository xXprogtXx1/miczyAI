const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");

// Aggiunge un messaggio alla chat
function aggiungiMessaggio(testo, mittente, usaMarkdown = false) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerHTML = usaMarkdown ? marked.parse(testo) : escapeHTML(testo);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  salvaCronologiaChat(); // Salva ogni volta che si aggiunge un messaggio
}

// Escape HTML per i messaggi utente
function escapeHTML(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
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

// Gestisce la richiesta al backend
async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input) return;

  aggiungiMessaggio(input, "utente");
  aggiungiLoader();

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await response.json();
    rimuoviLoader();
    aggiungiMessaggio(data.response || "Nessuna risposta ricevuta 😐", "ai", true);

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio("Errore nel parlare con MiczyAI 😢", "ai");
  }

  inputField.value = "";
}

// Gestisce l'invio con il tasto Invio
inputField.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    talkToMiczy();
  }
});

// Toggle modalità scura
toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});

// Salva la cronologia nel localStorage
function salvaCronologiaChat() {
  const messaggi = [...chatBox.querySelectorAll(".msg")].map(msg => {
    return {
      testo: msg.getAttribute("data-raw") || msg.innerText,
      mittente: msg.classList.contains("utente") ? "utente" : "ai"
    };
  });
  localStorage.setItem("chatHistory", JSON.stringify(messaggi));
}

// Carica la cronologia salvata
function caricaCronologiaChat() {
  const salvata = localStorage.getItem("chatHistory");
  if (salvata) {
    const messaggi = JSON.parse(salvata);
    messaggi.forEach(msg => {
      aggiungiMessaggio(msg.testo, msg.mittente, msg.mittente === "ai");
    });
  }
}

// Cancella la cronologia
function cancellaCronologiaChat() {
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
}

// Carica cronologia all'avvio
window.onload = function () {
  caricaCronologiaChat();
};

// Espone cancellaCronologia per uso HTML
window.cancellaCronologiaChat = cancellaCronologiaChat;
