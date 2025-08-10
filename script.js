// const inputField, toggleDark, chatBox, submitButton, mainTitle
const inputField = document.getElementById("userInput");
const toggleDark = document.getElementById("toggleDark");
const chatBox = document.getElementById("chat-box");
const submitButton = document.querySelector("#chatForm button");
const mainTitle = document.querySelector("header h1");

// glitch frasi titolo
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
    "MiczyAI (unstable)",
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

// click glitch titolo
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

// sottotitoli
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

// traduzioni testo
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

// traduzioni popup cookie
const testiCookieModal = {
  it: {
    title: "Cookie e Privacy",
    msg1: "Questo sito utilizza cookie tecnici per garantire la migliore esperienza utente. Per maggiori chiarimenti e informazioni",
    msg2: 'consulta la <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> e i <a href="/tos" target="_blank" rel="noopener noreferrer">Termini di Servizio</a>.',
    btn: "OK"
  },
  en: {
    title: "Cookies and Privacy",
    msg1: "This website uses technical cookies to ensure the best user experience. For more information and details",
    msg2: 'see the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and the <a href="/tos" target="_blank" rel="noopener noreferrer">Terms of Service</a>.',
    btn: "OK"
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

let sottotitoloTimer;

function scriviTestoGradualmente(elemento, testo, velocita = 50) {
  clearTimeout(sottotitoloTimer);
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

function aggiornaTestiCookieModal() {
  const c = testiCookieModal[lingua] || testiCookieModal.it;
  const cookieTitle = document.getElementById("cookieTitle");
  const cookieMessage1 = document.getElementById("cookieMessage1");
  const cookieMessage2 = document.getElementById("cookieMessage2");
  const closeCookieBtn = document.getElementById("closeCookie");

  if (cookieTitle) cookieTitle.innerText = c.title;
  if (cookieMessage1) cookieMessage1.innerText = c.msg1;
  if (cookieMessage2) cookieMessage2.innerHTML = c.msg2;
  if (closeCookieBtn) closeCookieBtn.innerText = c.btn;
}

function aggiornaLingua(lang) {
  lingua = lang;
  localStorage.setItem("lang", lang);

  const t = traduzioni[lang];
  const langBtn = document.getElementById("langBtn");

  mainTitle.textContent = t.titolo;
  document.title = t.titoloScheda;
  inputField.placeholder = t.placeholder;
  submitButton.textContent = t.invia;
  document.querySelector(".clear-btn").setAttribute("aria-label", t.cancella);

  scegliSottotitolo();

  if (langBtn) langBtn.textContent = lang === "it" ? "EN" : "IT";

  aggiornaTestiCookieModal();
}

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

function scriviRispostaGraduale(testo) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg-wrapper ai";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "🤖";

  const msg = document.createElement("div");
  msg.className = "msg ai";

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

  wrapper.appendChild(avatar);
  wrapper.appendChild(msg);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  let i = 0;
  const interval = setInterval(() => {
    if (i < testo.length) {
      msg.innerHTML = marked.parse(testo.slice(0, i + 1));
      if (!msg.contains(bottomRow)) msg.appendChild(bottomRow);
      chatBox.scrollTop = chatBox.scrollHeight;
      i++;
    } else {
      clearInterval(interval);
    }
  }, 15);
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
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    talkToMiczy();
  }
});

// gestione cronologia chat in locale
function salvaCronologiaChat() {
  try {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  } catch (e) {
    console.warn("LocalStorage pieno o non accessibile");
  }
}

function caricaCronologiaChat() {
  try {
    const dati = localStorage.getItem("chatHistory");
    if (dati) {
      chatHistory = JSON.parse(dati);
      chatHistory.forEach(messaggio => {
        aggiungiMessaggio(messaggio.content, messaggio.role === "user" ? "utente" : "ai");
      });
    }
  } catch (e) {
    chatHistory = [];
  }
}

document.querySelector(".clear-btn").addEventListener("click", () => {
  localStorage.removeItem("chatHistory");
  chatHistory = [];
  chatBox.innerHTML = "";
});

// --- gestione popup cookie ---

const cookieBtn = document.getElementById("cookieBtn");
const cookieModal = document.getElementById("cookieModal");
const closeCookie = document.getElementById("closeCookie");

cookieBtn.addEventListener("click", () => {
  cookieModal.classList.add("show");
});

closeCookie.addEventListener("click", () => {
  cookieModal.classList.remove("show");
});

// al cambio lingua aggiorna testi cookie
aggiornaTestiCookieModal();

// carica cronologia al caricamento pagina
window.onload = () => {
  caricaCronologiaChat();
};
