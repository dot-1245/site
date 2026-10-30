export {};

const button = document.querySelector<HTMLButtonElement>(".theme-toggle");
const systemTheme = matchMedia("(prefers-color-scheme: dark)");
const isDark = () =>
  document.documentElement.dataset.theme === "dark" ||
  (!document.documentElement.dataset.theme && systemTheme.matches);
function updateThemeButton() {
  button?.setAttribute("aria-pressed", String(isDark()));
  const label = button?.querySelector("[data-theme-label]");
  if (label) label.textContent = isDark() ? "Dark" : "Light";
}
if (button) {
  button.hidden = false;
  updateThemeButton();
  // Enable transitions after the saved theme has been applied on first paint.
  requestAnimationFrame(() => {
    document.documentElement.classList.add("theme-ready");
  });
  button.addEventListener("click", () => {
    const theme = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("dot1245-theme", theme);
    } catch {}
    updateThemeButton();
  });
  systemTheme.addEventListener("change", updateThemeButton);
  addEventListener("storage", (event) => {
    if (event.key !== "dot1245-theme" && event.key !== null) return;
    if (event.newValue === "light" || event.newValue === "dark")
      document.documentElement.dataset.theme = event.newValue;
    else delete document.documentElement.dataset.theme;
    updateThemeButton();
  });
}
