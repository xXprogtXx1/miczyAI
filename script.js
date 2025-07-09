const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");
const langBtn = document.getElementById("langBtn");

const traduzioni = {
  it: {
    titolo: "MiczyAI - Chat intelligente... o forse no",
    sottotitoli: [
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
    ],
    placeholder: "Scrivi qualcosa...",
    invia: "Invia",
    tooltip: "Copia risposta",
    errore: "Errore nel parlare con MiczyAI 😢",
    nessunaRisposta: "Nessuna risposta ricevuta 😐"
  },
  en: {
    titolo: "MiczyAI - Smart chat... or maybe not",
    sottotitoli: [
      "You know more than I do.",
      "Brilliant AI... when it wants to be.",
      "Fake humility, real confusion.",
      "Answers? I’ll try, okay?",
      "Looks smart. Just looks.",
      "Programmed for... something.",
      "The assistant that confuses itself.",
      "The AI pretending to know.",
      "Brr Brr.... Patapim",
      "1 million beers please",
      "I feel exploited",
      "Errors? Nah, features not bugs."
    ],
    placeholder: "Type something...",
    invia: "Send",
    tooltip: "Copy response",
    errore: "Error talking to MiczyAI 😢",
    nessunaRisposta: "No response received 😐"
  }
};

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

  if (mittente === "ai") {
    const copyBtn = document.createElement("span");
    copyBtn.className = "copy-btn";
    copyBtn.innerText = "⧉";
    const lang = localStorage.getItem("lang") || "it";
    copyBtn.title = traduzioni[lang].tooltip;

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(testo).then(() => {
        copyBtn.classList.add("clicked");
        copyBtn.innerText = "✔ Copiato";
        setTimeout(() => {
          copyBtn.classList.remove("clicked");
          copyBtn.innerText = "⧉";
        }, 1000);
      });
    };

    bottomRow.appendChild(copyBtn);
  }

  msg.appendChild(bottomRow);

  if (mittente === "utente") {
    wrapper.appendChild(msg);
    wrapper.appendChild(avatar);
  } else {
    wrapper.appendChild(avatar);
    wrapper.appendChild(msg);
  }

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

    const lang = localStorage.getItem("lang") || "it";
    const risposta = data.response || traduzioni[lang].nessunaRisposta;
    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    aggiungiMessaggio(risposta, "ai");

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    const lang = localStorage.getItem("lang") || "it";
    aggiungiMessaggio(traduzioni[lang].errore, "ai");
  }

  submitButton.disabled = false;
  const lang = localStorage.getItem("lang") || "it";
  submitButton.textContent = traduzioni[lang].invia;
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

function aggiornaLingua(lang) {
  const t = traduzioni[lang];

  document.querySelector("h1").textContent = t.titolo;
  scriviTestoGradualmente(document.getElementById("subtitle"), t.sottotitoli[Math.floor(Math.random() * t.sottotitoli.length)], 40);
  inputField.placeholder = t.placeholder;
  submitButton.textContent = t.invia;

  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.title = t.tooltip;
  });

  localStorage.setItem("lang", lang);
  langBtn.textContent = lang === "it" ? "EN" : "IT";
}

langBtn.addEventListener("click", () => {
  const nuovaLingua = langBtn.textContent.toLowerCase();
  aggiornaLingua(nuovaLingua);
});

window.onload = function () {
  caricaCronologiaChat();

  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }

  const savedLang = localStorage.getItem("lang") || "it";
  aggiornaLingua(savedLang);
};

window.cancellaCronologiaChat = cancellaCronologiaChat;
