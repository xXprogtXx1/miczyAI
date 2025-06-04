const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");

function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerText = testo;
  document.getElementById("chat-box").appendChild(msg);
  document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
}

async function talkToMiczy() {
  const input = inputField.value.trim();

  if (!input) {
    aggiungiMessaggio("Inserisci qualcosa prima di inviare!", "ai");
    return;
  }

  aggiungiMessaggio(input, "utente");
  aggiungiMessaggio("Sto pensando...", "ai");

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await response.json();
    const risposte = document.querySelectorAll(".ai");
    if (risposte.length) risposte[risposte.length - 1].remove();

    aggiungiMessaggio(data.response || "Nessuna risposta ricevuta 😐", "ai");

  } catch (error) {
    console.error(error);
    aggiungiMessaggio("Errore nel parlare con MiczyAI 😢", "ai");
  }

  inputField.value = "";
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
