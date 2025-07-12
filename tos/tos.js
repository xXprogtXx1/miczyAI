document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "it";

  const testi = {
    it: {
      titolo: "Termini di Servizio",
      ultimoAgg: "Ultimo aggiornamento: Luglio 2025",
      usoTitolo: "1. Utilizzo del Servizio",
      usoTesto: "MiczyAI è un chatbot sperimentale basato su intelligenza artificiale. È offerto solo per uso personale e legale.",
      contenutiTitolo: "2. Contenuti Generati",
      contenutiTesto: "Le risposte di MiczyAI sono generate automaticamente e possono contenere imprecisioni. L’utente è responsabile del loro utilizzo.",
      datiTitolo: "3. Account e Dati",
      datiTesto: "Non viene richiesto alcun account. Eventuali dati (come messaggi) sono trattati in modo anonimo per migliorare il servizio.",
      limitiTitolo: "4. Limitazioni",
      limitiLista: [
        "Non inviare contenuti offensivi, illegali o dannosi.",
        "Non compromettere o sovraccaricare il sistema.",
        "Non utilizzare bot o sistemi automatici."
      ],
      modificheTitolo: "5. Modifiche",
      modificheTesto: "I Termini possono essere aggiornati. Continuando a usare il sito, accetti le eventuali modifiche future.",
      torna: "Torna a MiczyAI",
      langBtn: "EN"
    },
    en: {
      titolo: "Terms of Service",
      ultimoAgg: "Last updated: July 2025",
      usoTitolo: "1. Service Usage",
      usoTesto: "MiczyAI is an experimental AI-based chatbot. It is offered only for personal and legal use.",
      contenutiTitolo: "2. Generated Content",
      contenutiTesto: "MiczyAI's responses are generated automatically and may contain inaccuracies. Users are responsible for how they use the content.",
      datiTitolo: "3. Account and Data",
      datiTesto: "No account is required. Any data (like messages) is processed anonymously to improve the service.",
      limitiTitolo: "4. Limitations",
      limitiLista: [
        "Do not send offensive, illegal or harmful content.",
        "Do not compromise or overload the system.",
        "Do not use bots or automated systems."
      ],
      modificheTitolo: "5. Changes",
      modificheTesto: "Terms may be updated. By continuing to use the site, you accept any future changes.",
      torna: "Back to MiczyAI",
      langBtn: "IT"
    }
  };

  function aggiornaTesto(lang) {
    const t = testi[lang];
    const sez = document.querySelector("section");
    document.querySelector("h1").textContent = t.titolo;
    sez.querySelector("p").innerHTML = `<strong>${t.ultimoAgg}</strong>`;
    document.querySelectorAll("h2")[0].textContent = t.usoTitolo;
    document.querySelectorAll("p")[1].textContent = t.usoTesto;
    document.querySelectorAll("h2")[1].textContent = t.contenutiTitolo;
    document.querySelectorAll("p")[2].textContent = t.contenutiTesto;
    document.querySelectorAll("h2")[2].textContent = t.datiTitolo;
    document.querySelectorAll("p")[3].textContent = t.datiTesto;
    document.querySelectorAll("h2")[3].textContent = t.limitiTitolo;

    const ul = sez.querySelector("ul");
    ul.innerHTML = "";
    t.limitiLista.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });

    document.querySelectorAll("h2")[4].textContent = t.modificheTitolo;
    document.querySelectorAll("p")[4].textContent = t.modificheTesto;
    document.querySelector("a").textContent = t.torna;

    const btn = document.getElementById("btnLingua");
    if (btn) btn.textContent = t.langBtn;

    document.title = `${t.titolo} - MiczyAI`;
  }

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
    const nuova = localStorage.getItem("lang") === "it" ? "en" : "it";
    localStorage.setItem("lang", nuova);
    aggiornaTesto(nuova);
  });

  document.body.appendChild(btnLingua);
  aggiornaTesto(lang);
});
