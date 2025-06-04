const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");

function aggiungiMessaggio(testo, mittente, isLoader = false) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;

  if (isLoader) {
    msg.innerHTML = `<span class="loader-dots"><span></span></span> ${testo}`;
    msg.dataset.loader = "true";
  } else {
    msg.innerText = testo;
  }

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
  aggiungiMessaggio("Sto pensando", "ai", true);

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await response.json();
    const chatBox = document.getElementById("chat-box");
    const loaderMsg = Array.from(chatBox.children).find(el => el.dataset.loader === "true");
    if (loaderMsg) loaderMsg.remove();

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
