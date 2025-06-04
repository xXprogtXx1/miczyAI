const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");

function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  
  if (mittente === "loader") {
    msg.innerHTML = `<span class="loader"></span> ${testo}`;
  } else {
    msg.innerText = testo;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function talkToMiczy() {
  const input = inputField.value.trim();

  if (!input) {
    aggiungiMessaggio("Inserisci qualcosa prima di inviare!", "ai");
    return;
  }

  aggiungiMessaggio(input, "utente");
  aggiungiMessaggio("Sto pensando...", "loader");

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await response.json();

    const loaderMsg = document.querySelector(".msg.loader");
    if (loaderMsg) loaderMsg.remove();

    aggiungiMessaggio(data.response || "Nessuna risposta ricevuta 😐", "ai");

  } catch (error) {
    console.error(error);
    const loaderMsg = document.querySelector(".msg.loader");
    if (loaderMsg) loaderMsg.remove();
    aggiungiMessaggio("Errore nel parlare con MiczyAI 😢", "ai");
  }

  inputField.value = "";
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
});
