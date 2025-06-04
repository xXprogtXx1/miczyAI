const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("miczyDarkMode", "true");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("miczyDarkMode", "false");
  }
});

window.addEventListener("load", () => {
  if (localStorage.getItem("miczyDarkMode") === "true") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }
});
