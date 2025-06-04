const inputField = document.getElementById("userInput");
const output = document.getElementById("output");
const darkToggle = document.getElementById("darkModeToggle");

// Funzione per chiamare API backend
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

// Event listener per invio con Invio (enter)
inputField.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

// Toggle dark mode e salva preferenza su localStorage
darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }
});

// Al caricamento pagina applica preferenza dark mode salvata
window.addEventListener("DOMContentLoaded", () => {
  const darkModeSetting = localStorage.getItem("darkMode");
  if (darkModeSetting === "true") {
    darkToggle.checked = true;
    document.body.classList.add("dark");
  }
});
