document.getElementById("send-button").addEventListener("click", async () => {
  const userInput = document.getElementById("user-input").value;
  const responseDiv = document.getElementById("response");

  if (!userInput.trim()) {
    responseDiv.innerText = "Per favore scrivi qualcosa.";
    return;
  }

  responseDiv.innerText = "Attendere...";

  try {
    const res = await fetch("https://miczyai-backend.replit.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });

    if (!res.ok) throw new Error("Errore nella richiesta");

    const data = await res.json();
    responseDiv.innerText = data.response || "Nessuna risposta ricevuta.";
  } catch (error) {
    console.error("Errore:", error);
    responseDiv.innerText = "Errore nel contattare il server.";
  }
});

// Dark mode toggle
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
