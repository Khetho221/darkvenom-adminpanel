// ===============================
// DARK / LIGHT THEME SYSTEM
// (NO HTML CHANGES REQUIRED)
// ===============================

// Inject CSS variables dynamically
const themeStyle = document.createElement("style");
themeStyle.innerHTML = `
:root {
  --bg: #020617;
  --card: #020617;
  --text: #e5e7eb;
  --border: #1e293b;
  --accent: #38bdf8;
}

html[data-theme="light"] {
  --bg: #f8fafc;
  --card: #ffffff;
  --text: #020617;
  --border: #cbd5f5;
  --accent: #2563eb;
}

/* Global overrides */
body {
  background: var(--bg) !important;
  color: var(--text) !important;
}

header,
.card {
  background: var(--card) !important;
  border-color: var(--border) !important;
}

input,
button,
table,
th,
td {
  background: var(--card) !important;
  color: var(--text) !important;
  border-color: var(--border) !important;
}

button:hover {
  opacity: 0.9;
}
`;
document.head.appendChild(themeStyle);

// Load saved theme or system preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  document.documentElement.setAttribute("data-theme", "light");
}

// Toggle function (global)
window.toggleTheme = function () {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
};

// Keyboard shortcut: CTRL + D
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    toggleTheme();
  }
});
