const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");

let linguaCorrente = "IT";
let chatHistory = [];
let scriviTimeout;

const traduzioni = {
  IT: {
    placeholder: "Scrivi qualcosa...",
    invia: "Invia",
    errore: "Errore nel parlare con MiczyAI 😢",
    nessunaRisposta: "Nessuna risposta ricevuta 😐",
    copia: "Copia risposta",
    titolo: "MiczyAI - Chat intelligente... o forse no",
    descrizione: "MiczyAI è la tua IA personale: chatta, chiedi, esplora e divertiti con l'AI più... creativa!"
  },
  EN: {
    placeholder: "Type something...",
    invia: "Send",
    errore: "Error talking to MiczyAI 😢",
    nessunaRisposta: "No response received 😐",
    copia: "Copy response",
    titolo: "MiczyAI - Smart chat... or maybe not",
    descrizione: "MiczyAI is your personal AI: chat, ask, explore and have fun with the most... creative assistant!"
  }
};

const sottotitoliIT = [
  "Sai più tu che io.", "IA brillante... quando ha voglia.", "Finta umiltà, vera confusione.",
  "Risposte? Ci provo, ok?", "Sembra sveglio. Sembra.", "Programmata per... qualcosa",
  "L'assistente che confonde anche se stesso.", "L’IA che fa finta di sapere.",
  "Brr Brr.... Patapim", "1 million beers please", "Mi sento sfruttato", "Errori? Nah sono feature, non bug."
];

const sottotitoliEN = [
  "You know more than I do.", "Brilliant AI... when it feels like it.", "Fake humility, real confusion.",
  "Answers? I’ll try, OK?", "Looks smart. Looks.", "Programmed for... something.",
  "The assistant that confuses even itself.", "The AI that pretends to know.",
  "Brr Brr.... Patapim", "1 million beers please", "I feel exploited", "Bugs? Nah, features!"
];

function scriviTestoGradualmente(elemento, testo, velocita = 50) {
  clearTimeout(scriviTimeout);
  elemento.innerHTML = "";
  let i = 0;
  function scrivi() {
    if (i < testo.length) {
      const char = testo[i] === " " ? "&nbsp;" : testo[i];
      elemento.innerHTML += char;
      i++;
      scriviTimeout = setTimeout(scrivi, velocita);
    }
  }
  scrivi();
}

function cambiaLingua(lang) {
  linguaCorrente = lang;
  const isEN = lang === "EN";
  inputField.placeholder = traduzioni[lang].placeholder;
  submitButton.textContent = traduzioni[lang].invia;
  document.title = traduzioni[lang].titolo;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", traduzioni[lang].descrizione);
  }
  const sottotitoloElemento = document.getElementById("subtitle");
  const frasi = isEN ? sottotitoliEN : sottotitoliIT;
  const fraseCasuale = frasi[Math.floor(Math.random() * frasi.length)];
  scriviTestoGradualmente(sottotitoloElemento, fraseCasuale, 40);
}

function aggiungiMessaggio(testo, mittente) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg-wrapper ${mittente}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = mittente === "ai" ? "🤖" : "🧑";

  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  msg.innerHTML = mittente === "ai" ? marked.parse(testo) : testo;

  // ✅ Se AI, aggiungi timestamp + copia sotto il messaggio
  if (mittente === "ai") {
    const meta = document.createElement("div");
    meta.className = "msg-meta";

    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";
    const ora = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    timestamp.textContent = ora;

    const copyBtn = document.createElement("span");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "📋";
    copyBtn.title = traduzioni[linguaCorrente].copia;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(testo).then(() => {
        copyBtn.textContent = "✅";
        setTimeout(() => copyBtn.textContent = "📋", 1000);
      });
    };

    meta.appendChild(timestamp);
    meta.appendChild(copyBtn);
    msg.appendChild(meta);
  }

  // ✅ Se utente, solo messaggio
  if (mittente === "utente") {
    const timestamp = document.createElement("div");
    timestamp.className = "msg-meta";
    const ora = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    timestamp.textContent = ora;
    msg.appendChild(timestamp);
  }

  wrapper.appendChild(avatar);
  wrapper.appendChild(msg);
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
  loader.innerHTML = `<div class="loader"><div></div><div></div><div></div></div>`;

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

    const risposta = data.response || traduzioni[linguaCorrente].nessunaRisposta;
    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    aggiungiMessaggio(risposta, "ai");

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio(traduzioni[linguaCorrente].errore, "ai");
  }

  submitButton.disabled = false;
  submitButton.textContent = traduzioni[linguaCorrente].invia;
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

  const switchContainer = document.querySelector("header");

  const langBtn = document.createElement("button");
  langBtn.id = "lang-toggle";
  langBtn.textContent = "EN";
  langBtn.setAttribute("aria-label", "Cambia lingua");

  langBtn.onclick = () => {
    const current = langBtn.textContent;
    const newLang = current === "EN" ? "IT" : "EN";
    langBtn.textContent = newLang;
    cambiaLingua(newLang);
    localStorage.setItem("lang", newLang);
  };

  switchContainer.appendChild(langBtn);

  const savedLang = localStorage.getItem("lang") || "IT";
  langBtn.textContent = savedLang;
  cambiaLingua(savedLang);
};

window.cancellaCronologiaChat = cancellaCronologiaChat;
