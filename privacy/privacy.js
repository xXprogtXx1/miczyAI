document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "it";

  const testi = {
    it: {
      titolo: "Privacy Policy",
      ultimoAggiornamento: "Ultimo aggiornamento: Luglio 2025",
      datiRaccoltiTitolo: "1. Dati Raccolti",
      datiRaccoltiTesto: "MiczyAI non raccoglie dati personali identificabili. Possiamo trattare messaggi anonimi e dati tecnici per fini statistici o tecnici.",
      webhookTitolo: "2. Webhook Discord",
      webhookTesto: "I messaggi dell’utente possono essere inviati a un webhook Discord privato, a solo scopo di sviluppo. Nessun dato sensibile viene incluso.",
      cookieTitolo: "3. Cookie",
      cookieTesto: "MiczyAI utilizza solo cookie tecnici per salvare preferenze come tema o lingua. Nessun tracciamento pubblicitario è in uso.",
      sicurezzaTitolo: "4. Sicurezza",
      sicurezzaTesto: "La connessione è protetta tramite HTTPS. I dati non sono condivisi con terze parti.",
      dirittiTitolo: "5. Diritti",
      dirittiTesto: "Puoi contattarci per visualizzare o cancellare eventuali dati trattati (se identificabili).",
      contatti: "Contattaci: ",
      contattiInfo: "[inserisci una mail o Discord server]",
      tornaLinkTesto: "Torna a MiczyAI",
      linguaBtn: "EN"
    },
    en: {
      titolo: "Privacy Policy",
      ultimoAggiornamento: "Last updated: July 2025",
      datiRaccoltiTitolo: "1. Data Collected",
      datiRaccoltiTesto: "MiczyAI does not collect personally identifiable information. We may process anonymous messages and technical data for statistical or technical purposes.",
      webhookTitolo: "2. Discord Webhook",
      webhookTesto: "User messages may be sent to a private Discord webhook, solely for development purposes. No sensitive data is included.",
      cookieTitolo: "3. Cookies",
      cookieTesto: "MiczyAI only uses technical cookies to save preferences like theme or language. No advertising tracking is used.",
      sicurezzaTitolo: "4. Security",
      sicurezzaTesto: "The connection is protected via HTTPS. Data is not shared with third parties.",
      dirittiTitolo: "5. Rights",
      dirittiTesto: "You can contact us to view or delete any processed data (if identifiable).",
      contatti: "Contact us: ",
      contattiInfo: "[insert email or Discord server]",
      tornaLinkTesto: "Back to MiczyAI",
      linguaBtn: "IT"
    }
  };

  function aggiornaTesto(lang) {
    document.querySelector("h1").textContent = testi[lang].titolo;
    document.querySelector("p:nth-of-type(1)").innerHTML = `<strong>${testi[lang].ultimoAggiornamento}</strong>`;
    document.querySelector("h2:nth-of-type(1)").textContent = testi[lang].datiRaccoltiTitolo;
    document.querySelector("section p:nth-of-type(2)").textContent = testi[lang].datiRaccoltiTesto;
    document.querySelector("h2:nth-of-type(2)").textContent = testi[lang].webhookTitolo;
    document.querySelector("section p:nth-of-type(3)").textContent = testi[lang].webhookTesto;
    document.querySelector("h2:nth-of-type(3)").textContent = testi[lang].cookieTitolo;
    document.querySelector("section p:nth-of-type(4)").textContent = testi[lang].cookieTesto;
    document.querySelector("h2:nth-of-type(4)").textContent = testi[lang].sicurezzaTitolo;
    document.querySelector("section p:nth-of-type(5)").textContent = testi[lang].sicurezzaTesto;
    document.querySelector("h2:nth-of-type(5)").textContent = testi[lang].dirittiTitolo;
    document.querySelector("section p:nth-of-type(6)").textContent = testi[lang].dirittiTesto;
    document.querySelector("section p:nth-of-type(7)").innerHTML = `${testi[lang].contatti}<em>${testi[lang].contattiInfo}</em>`;
    document.querySelector("section p:nth-of-type(8) a").textContent = testi[lang].tornaLinkTesto;

    // Aggiorna il testo del bottone lingua
    const btn = document.getElementById("btnLingua");
    if (btn) btn.textContent = testi[lang].linguaBtn;
  }

  // Crea il bottone per cambiare lingua in alto a destra
  const btnLingua = document.createElement("button");
  btnLingua.id = "btnLingua";
  btnLingua.style.position = "fixed";
  btnLingua.style.top = "1rem";
  btnLingua.style.right = "1rem";
  btnLingua.style.padding = "0.4rem 0.8rem";
  btnLingua.style.cursor = "pointer";
  btnLingua.style.border = "none";
  btnLingua.style.borderRadius = "4px";
  btnLingua.style.backgroundColor = "#2196f3";
  btnLingua.style.color = "white";
  btnLingua.style.fontWeight = "bold";
  btnLingua.style.zIndex = "1000";
  btnLingua.title = "Cambia lingua / Switch language";

  btnLingua.addEventListener("click", () => {
    const nuovaLingua = localStorage.getItem("lang") === "it" ? "en" : "it";
    localStorage.setItem("lang", nuovaLingua);
    aggiornaTesto(nuovaLingua);
  });

  document.body.appendChild(btnLingua);

  // Inizializza la pagina con la lingua corretta
  aggiornaTesto(lang);
});
