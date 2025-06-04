const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");

function aggiungiMessaggio(testo, mittente) {
  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerText = testo;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

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
    aggiungiMessaggio(data.response || "Nessuna risposta ricevuta 😐", "ai");

  } catch (error) {
    console.error(error);
    rimuoviLoader();
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
