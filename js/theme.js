const style=document.createElement("style");
style.textContent=`
:root{--bg:#020617;--txt:#e5e7eb}
html[data-theme="light"]{--bg:#f8fafc;--txt:#020617}
body{background:var(--bg);color:var(--txt)}
`;
document.head.appendChild(style);
