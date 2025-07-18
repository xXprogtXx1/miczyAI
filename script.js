const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");
const mainTitle = document.querySelector("header h1");

const glitchFrasi = {
  it: [
    "Miczy.exe crashato",
    "MiczyAI++",
    "MiczyGPT-0",
    "Miczyβeta",
    "Miczy 🤯 AI",
    "Miczy🤡AI",
    "MiczyAI (instabile)",
    "MiczyAI (unstable)",
    "🎉 Congratulazioni, hai sbloccato il nulla",
    "Se clicchi di nuovo potrei diventare senziente 😬",
    "💬 Bruh.",
    "🚀 Elon non approverebbe questo codice",
    "🛠️ Error 007: licenza di pensare revocata",
    "🎭 Questa IA finge bene, vero?",
    "🤷 Nessuna AI è stata maltrattata in questo glitch",
    "👀 Ti vedo.",
    "Behind you.",
    "📞 Sto chiamando il supporto. Ah no, sono io.",
    "404_AI_NOT_FOUND"
  ],
 en: [
  "Miczy.exe crashed",
  "MiczyAI++",
  "MiczyGPT-0",
  "Miczyβeta",
  "Miczy 🤯 AI",
  "Miczy🤡AI",
  "MiczyAI (unstable)",
  "MiczyAI (unstable)", // stessa frase in italiano e inglese
  "🎉 Congrats, you've unlocked nothing",
  "Click again and I might become sentient 😬",
  "💬 Bruh.",
  "🚀 Elon wouldn't approve this code",
  "🛠️ Error 007: license to think revoked",
  "🎭 This AI is pretending quite well, right?",
  "🤷 No AIs were harmed during this glitch",
  "👀 I'm watching you.",
  "Behind you.",
  "📞 Calling support. Oh wait, that's me.",
  "404_AI_NOT_FOUND"
]
};

mainTitle.addEventListener("click", () => {
  const lista = glitchFrasi[lingua] || glitchFrasi.en;
  const casuale = lista[Math.floor(Math.random() * lista.length)];
  const testoOriginale = traduzioni[lingua].titolo;

  mainTitle.classList.add("glitch");
  mainTitle.textContent = casuale;

  setTimeout(() => {
    mainTitle.textContent = testoOriginale;
    mainTitle.classList.remove("glitch");
  }, 3000);
});

const subtitleElemento = document.getElementById("subtitle");

const sottotitoli = {
  it: [
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
  en: [
    "You know more than me.",
    "Brilliant AI... when it feels like it.",
    "Fake humility, real confusion.",
    "Answers? I'll try, okay?",
    "Seems awake. Maybe.",
    "Programmed for... something",
    "The assistant that confuses even itself.",
    "The AI that pretends to know.",
    "Brr Brr.... Patapim",
    "1 million beers please",
    "I feel exploited",
    "Errors? Nah, features, not bugs."
  ]
};

const traduzioni = {
  it: {
    titolo: "MiczyAI",
    titoloScheda: "MiczyAI - Chat intelligente... o forse no",
    placeholder: "Scrivi qualcosa...",
    invia: "Invia",
    copia: "Copia risposta",
    copiato: "✔ Copiato",
    erroreChat: "Errore nel parlare con MiczyAI 😢",
    cancella: "Cancella cronologia chat"
  },
  en: {
    titolo: "MiczyAI",
    titoloScheda: "MiczyAI - Smart chat... or maybe not",
    placeholder: "Type something...",
    invia: "Send",
    copia: "Copy response",
    copiato: "✔ Copied",
    erroreChat: "Error talking to MiczyAI 😢",
    cancella: "Clear chat history"
  }
};

let chatHistory = [];
let lingua = localStorage.getItem("lang") || "it";

window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  header.style.position = "relative";

  const langBtn = document.createElement("button");
  langBtn.id = "langBtn";
  langBtn.style.position = "absolute";
  langBtn.style.top = "5px";
  langBtn.style.left = "10px";
  langBtn.style.cursor = "pointer";
  langBtn.style.userSelect = "none";
  langBtn.title = "Cambia lingua / Switch language";

  header.appendChild(langBtn);

  langBtn.addEventListener("click", () => {
    aggiornaLingua(lingua === "it" ? "en" : "it");
  });

  aggiornaLingua(lingua);
});

let sottotitoloTimer; // globale per controllare l'animazione

function scriviTestoGradualmente(elemento, testo, velocita = 50) {
  clearTimeout(sottotitoloTimer); // interrompe l'animazione precedente
  elemento.innerHTML = "";
  let i = 0;

  function scrivi() {
    if (i < testo.length) {
      const char = testo[i] === " " ? "&nbsp;" : testo[i];
      elemento.innerHTML += char;
      i++;
      sottotitoloTimer = setTimeout(scrivi, velocita);
    }
  }

  scrivi();
}

function scegliSottotitolo() {
  const lista = sottotitoli[lingua];
  const fraseCasuale = lista[Math.floor(Math.random() * lista.length)];
  scriviTestoGradualmente(subtitleElemento, fraseCasuale, 40);
}

function aggiornaLingua(lang) {
  lingua = lang;
  localStorage.setItem("lang", lang);

  const t = traduzioni[lang];
  const langBtn = document.getElementById("langBtn");

  // Titolo visibile nel sito
  mainTitle.textContent = t.titolo;

  // Titolo scheda browser
  document.title = t.titoloScheda;

  // Placeholder input
  inputField.placeholder = t.placeholder;

  // Bottone invia
  submitButton.textContent = t.invia;

  // Bottone cancella
  document.querySelector(".clear-btn").setAttribute("aria-label", t.cancella);

  // Testo sottotitolo random
  scegliSottotitolo();

  // Aggiorna testo bottone lingua
  if (langBtn) langBtn.textContent = lang === "it" ? "EN" : "IT";
}

function aggiungiMessaggio(testo, mittente) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg-wrapper ${mittente}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = mittente === "ai" ? "🤖" : "👤";

  const msg = document.createElement("div");
  msg.className = `msg ${mittente}`;
  // Per i messaggi AI usiamo marked, per l'utente testo semplice
  msg.innerHTML = mittente === "ai" ? marked.parse(testo) : testo;

  const bottomRow = document.createElement("div");
  bottomRow.className = "msg-meta";

  if (mittente === "ai") {
    const copyBtn = document.createElement("span");
    copyBtn.className = "copy-btn";
    copyBtn.innerText = "⧉";
    copyBtn.title = traduzioni[lingua].copia;

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(testo).then(() => {
        copyBtn.classList.add("clicked");
        copyBtn.innerText = traduzioni[lingua].copiato;
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

// Funzione per mostrare il loader
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

// Rimuove il loader
function rimuoviLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

// Funzione che simula la scrittura graduale della risposta AI
function scriviRispostaGraduale(testo) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg-wrapper ai";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "🤖";

  const msg = document.createElement("div");
  msg.className = "msg ai";

  // Crea il container per i pulsanti/copia, che verrà aggiunto al termine
  const bottomRow = document.createElement("div");
  bottomRow.className = "msg-meta";

  const copyBtn = document.createElement("span");
  copyBtn.className = "copy-btn";
  copyBtn.innerText = "⧉";
  copyBtn.title = traduzioni[lingua].copia;

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(testo).then(() => {
      copyBtn.classList.add("clicked");
      copyBtn.innerText = traduzioni[lingua].copiato;
      setTimeout(() => {
        copyBtn.classList.remove("clicked");
        copyBtn.innerText = "⧉";
      }, 1000);
    });
  };

  bottomRow.appendChild(copyBtn);

  // Aggiungo inizialmente avatar e msg (senza testo)
  wrapper.appendChild(avatar);
  wrapper.appendChild(msg);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  let i = 0;
  const interval = setInterval(() => {
    if (i < testo.length) {
      // Aggiungo progressivamente il testo, utilizzando marked per formattazione
      msg.innerHTML = marked.parse(testo.slice(0, i + 1));
      // Riaggiungo il bottomRow (i pulsanti) dopo l'aggiornamento del contenuto
      if (!msg.contains(bottomRow)) msg.appendChild(bottomRow);
      chatBox.scrollTop = chatBox.scrollHeight;
      i++;
    } else {
      clearInterval(interval);
    }
  }, 15); // Regola la velocità di scrittura (ms per carattere)
}

async function talkToMiczy() {
  const input = inputField.value.trim();
  if (!input) return;

  submitButton.disabled = true;
  submitButton.textContent = lingua === "it" ? "mhhh..." : "hmm...";

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

    const risposta = data.response || (lingua === "it"
      ? "Nessuna risposta ricevuta 😐"
      : "No response received 😐");

    chatHistory.push({ role: "assistant", content: risposta });
    salvaCronologiaChat();
    scriviRispostaGraduale(risposta);

  } catch (error) {
    console.error(error);
    rimuoviLoader();
    aggiungiMessaggio(traduzioni[lingua].erroreChat, "ai");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = traduzioni[lingua].invia;
    inputField.value = "";
  }
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
  localStorage.setItem("lang", lingua);
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

window.onload = function () {
  caricaCronologiaChat();

  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-mode");
    toggleDark.checked = true;
  }

  // ✅ Collega il pulsante "cancella cronologia"
  const clearBtn = document.querySelector(".clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const conferma = confirm(
        lingua === "it"
          ? "Sei sicuro di voler cancellare la cronologia?"
          : "Are you sure you want to clear the chat history?"
      );
      if (conferma) cancellaCronologiaChat();
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".bubble-container");
  const numBolle = 40;

  for (let i = 0; i < numBolle; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    // Posizione orizzontale casuale
    bubble.style.left = `${Math.random() * 100}%`;

    // Dimensioni casuali (tra 20px e 60px)
    const size = 20 + Math.random() * 40;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Durata animazione (tra 15s e 30s)
    const duration = 15 + Math.random() * 15;
    bubble.style.animationDuration = `${duration}s`;

    // Ritardo inizio (per non farle partire tutte insieme)
    bubble.style.animationDelay = `${Math.random() * 10}s`;

    container.appendChild(bubble);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const fab = document.querySelector(".social-fab");
  const toggle = document.getElementById("fabToggle");
  const icon = document.getElementById("fabIcon");

  toggle.addEventListener("click", () => {
    fab.classList.toggle("open");

    if (fab.classList.contains("open")) {
      // Cambia icona in "X"
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.innerHTML = `
        <path d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.17 7.1 4.3a1 1 0 0 0-1.4 1.4L10.83 12l-5.13 5.1a1 1 0 0 0 1.4 1.4L12 14.83l4.9 4.9a1 1 0 0 0 1.4-1.4L13.17 12l5.13-5.1z"/>
      `;
    } else {
      // Cambia icona in "share"
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.innerHTML = `
        <path d="M18 8a3 3 0 1 0-2.83-2H9.83A3 3 0 1 0 7 8c0 .21.02.42.05.62l6.17 3.7a3.01 3.01 0 1 0 .76-1.3L8.24 7.34A3.01 3.01 0 0 0 6 8z"/>
      `;
    }
  });
});

function copyEmail() {
  const email = "miczy690@gmail.com"; // ← Cambia con la tua email
  navigator.clipboard.writeText(email).then(() => {
    const tooltip = document.querySelector(".email-tooltip");
    tooltip.textContent = "Copiata!";
    setTimeout(() => {
      tooltip.textContent = email;
    }, 1500);
  });
}

document.addEventListener("DOMContentLoaded", () => {

  const cookieBtn = document.getElementById("cookieBtn");
  const cookieModal = document.getElementById("cookieModal");
  const closeCookie = document.getElementById("closeCookie");

  if (cookieBtn && cookieModal && closeCookie) {
    cookieBtn.addEventListener("click", () => {
      cookieModal.classList.add("show");
    });

    closeCookie.addEventListener("click", () => {
      cookieModal.classList.remove("show");
    });
  }
});
