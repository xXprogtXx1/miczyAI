const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const sendButton = document.querySelector("button");
const chatBox = document.getElementById("chat-box");

// Carica preferenza dark mode
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  toggleDark.checked = true;
}

function aggiungiMessaggio(testo, mittente, isLoader = false) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  if (isLoader) {
    msg.classList.add("loader");
    msg.innerHTML = `Sto pensando<span></span>`;
  } else {
    msg.textContent = testo;
  }
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input) {
    aggiungiMessaggio("Inserisci qualcosa prima di inviare!", "ai");
    return;
  }

  aggiungiMessaggio(input, "utente");

  // Disabilita input e bottone mentre aspetti risposta
  inputField.disabled = true;
  sendButton.disabled = true;

  // Aggiungi loader
  const loaderMsg = aggiungiMessaggio("", "ai", true);

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await response.json();

    // Rimuovi loader
    if (loaderMsg) loaderMsg.remove();

    aggiungiMessaggio(data.response || "Nessuna risposta ricevuta 😐", "ai");

  } catch (error) {
    console.error(error);
    if (loaderMsg) loaderMsg.remove();
    aggiungiMessaggio("Errore nel parlare con MiczyAI 😢", "ai");
  }

  inputField.value = "";
  inputField.disabled = false;
  sendButton.disabled = false;
  inputField.focus();
}

inputField.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
  // Salva preferenza dark mode
  if(document.body.classList.contains("dark-mode")){
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.removeItem("darkMode");
  }
});
