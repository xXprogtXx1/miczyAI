const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");

const sottotitoli = [
  "Sai più tu che io.",
  "IA brillante... quando ha voglia.",
  "Finta umiltà, vera confusione.",
  "Risposte? Ci provo, ok?",
  "Sembra sveglio. Sembra.",
  "Programmata per... qualcosa",
  "L'assistente che confonde anche se stesso.",
  "L’IA che fa finta di sapere.",
  "Brr Brr.... Patapim",
  "1 million beers please",
  "Mi sento sfruttato",
  "Errori? Nah sono feature, non bug."
];

function scriviTestoGradualmente(elemento, testo, velocita = 50) {
  elemento.innerHTML = "";
  let i = 0;
  function scrivi() {
    if (i < testo.length) {
      const char = testo[i] === " " ? "&nbsp;" : testo[i];
      elemento.innerHTML += char;
      i++;
      setTimeout(scrivi, velocita);
    }
  }
  scrivi();
}

window.addEventListener("DOMContentLoaded", () => {
  const sottotitoloElemento = document.getElementById("subtitle");
  const fraseCasuale = sottotitoli[Math.floor(Math.random() * sottotitoli.length)];
  scriviTestoGradualmente(sottotitoloElemento, fraseCasuale, 40);
});

let chatHistory = [];

function aggiungiMessaggio(testo, mittente) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg-wrapper ${mittente}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = mittente === "ai" ? "🤖" : "👤";

  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerHTML = mittente === "ai" ? marked.parse(testo) : testo;

  const bottomRow = document.createElement("div");
  bottomRow.className = "msg-meta";

  const timestamp = document.createElement("span");
  timestamp.className = "timestamp";
  const ora = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  timestamp.textContent = ora;

  if (mittente === "ai") {
    const copyBtn = document.createElement("span");
    copyBtn.className = "copy-btn";
    copyBtn.innerText = "⧉";
    copyBtn.title = "Copia risposta";
    copyBtn.setAttribute("data-tooltip", "Copia risposta");

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(testo).then(() => {
        copyBtn.innerText = "✅";
        copyBtn.setAttribute("data-tooltip", "Copiato!");
        setTimeout(() => {
          copyBtn.innerText = "⧉";
          copyBtn.setAttribute("data-tooltip", "Copia risposta");
        }, 1000);
      });
    };

    bottomRow.appendChild(copyBtn);
    bottomRow.appendChild(timestamp);
  } else {
    bottomRow.appendChild(timestamp);
  }

  // Contenitore msg + timestamp sotto
  const msgContainer = document.createElement("div");
  msgContainer.className = "msg-container";
  msgContainer.appendChild(msg);
  msgContainer.appendChild(bottomRow);

  // Riga messaggio + avatar
  const msgRow = document.createElement("div");
  msgRow.className = "msg-row";

  if (mittente === "utente") {
    msgRow.appendChild(msgContainer);
    msgRow.appendChild(avatar);
  } else {
    msgRow.appendChild(avatar);
    msgRow.appendChild(msgContainer);
  }

  wrapper.appendChild(msgRow);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
  salvaCronologiaChat();
}

function aggiungiLoader() {
  const loaderWrapper = document.createElement("div");
  loaderWrapper.className = "msg-wrapper ai";
  loaderWrapper.setAttribute("id", "loader");

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "🤖";

  const loader = document.createElement("div");
  loader.className = "msg ai";
  loader.innerHTML = `
    <div class="loader">
      <div></div><div></div><div></div>
    </div>
  `;

  loaderWrapper.appendChild(avatar);
  loaderWrapper.appendChild(loader);
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

  submitButton.disabled = true;
  submitButton.textContent = "mhhh...";

  aggiungiMessaggio(input, "utente");
  chatHistory.push({ role: "user", content: input });
  aggiungiLoader();

  try {
    const response = await fetch("https://backend-miczy-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory })
    });

    const data = await response.json();
    rimuoviLoader();

    const risposta = data.response || "Nessuna risposta ricevuta 😐";
    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    aggiungiMessaggio(risposta, "ai");

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio("Errore nel parlare con MiczyAI 😢", "ai");
  }

  submitButton.disabled = false;
  submitButton.textContent = "Invia";
  inputField.value = "";
}

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    talkToMiczy();
  }
});

toggleDark.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", toggleDark.checked);
});

function salvaCronologiaChat() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function caricaCronologiaChat() {
  const salvata = localStorage.getItem("chatHistory");
  if (salvata) {
    chatHistory = JSON.parse(salvata);
    chatBox.innerHTML = "";
    chatHistory.forEach(msg => {
      aggiungiMessaggio(msg.content, msg.role === "user" ? "utente" : "ai");
    });
  }
}

function cancellaCronologiaChat() {
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
  chatHistory = [];
}

window.onload = function () {
  caricaCronologiaChat();
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }
};

window.cancellaCronologiaChat = cancellaCronologiaChat;
