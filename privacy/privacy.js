document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.createElement("button");
  langBtn.id = "langBtn";
  langBtn.style.position = "fixed";
  langBtn.style.top = "10px";
  langBtn.style.right = "10px";
  langBtn.style.padding = "0.5rem 1rem";
  langBtn.style.borderRadius = "8px";
  langBtn.style.border = "none";
  langBtn.style.cursor = "pointer";
  langBtn.style.zIndex = 1000;

  document.body.appendChild(langBtn);

  function updateLanguage(lang) {
    localStorage.setItem("lang", lang);
    if (lang === "en") {
      document.querySelectorAll(".lang-it").forEach(el => el.style.display = "none");
      document.querySelectorAll(".lang-en").forEach(el => el.style.display = "");
      langBtn.textContent = "Italiano";
    } else {
      document.querySelectorAll(".lang-en").forEach(el => el.style.display = "none");
      document.querySelectorAll(".lang-it").forEach(el => el.style.display = "");
      langBtn.textContent = "English";
    }
  }

  // Leggi lingua da localStorage o default it
  const savedLang = localStorage.getItem("lang") || "it";
  updateLanguage(savedLang);

  // Cambia lingua al click sul bottone
  langBtn.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "it";
    const newLang = currentLang === "it" ? "en" : "it";
    updateLanguage(newLang);
  });
});
