const inputField = document.getElementById("userInput");
const output = document.getElementById("output");
const toggleDark = document.getElementById("toggleDark");

async function talkToMiczy() {
  const input = inputField.value.trim();

  if (!input) {
    output.innerText = "Inserisci qualcosa prima di inviare!";
    return;
  }

  output.innerText = "Sto pensando...";

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    if (!response.ok) {
      throw new Error(`Server ha risposto con codice ${response.status}`);
    }

    const data = await response.json();

    if (!data.response) {
      output.innerText = "Nessuna risposta ricevuta 😐";
    } else {
      output.innerText = data.response;
    }

    inputField.value = "";

  } catch (error) {
    console.error(error);
    if (error.message.includes("Failed to fetch")) {
      output.innerText = "Impossibile raggiungere il server, controlla la connessione.";
    } else {
      output.innerText = "Errore nel parlare con MiczyAI 😢";
    }
  }
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
