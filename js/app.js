import "./theme.js";
import { ADMINS, ROLE_PERMS } from "./config.js";
import { summarizeNFTs } from "./nft.js";

let currentAdmin = null;
let appOpen = localStorage.getItem("appOpen") !== "false";

// LOGIN
window.login = function () {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const msg = document.getElementById("loginMsg");

  if (!u || !p) {
    msg.textContent = "Enter username and password";
    return;
  }

  const found = ADMINS.find(a => a.user === u && a.pass === p);
  if (!found) {
    msg.textContent = "Invalid username or password";
    return;
  }

  currentAdmin = found;
  msg.textContent = "";

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  render();
};

// APP CONTROL
window.toggleApp = function () {
  if (!ROLE_PERMS[currentAdmin.role]?.toggleApp) return;

  appOpen = !appOpen;
  localStorage.setItem("appOpen", appOpen);
  render();
};

function render() {
  const status = document.getElementById("appStatus");
  status.textContent = appOpen ? "OPEN" : "CLOSED";
  status.style.color = appOpen ? "#22c55e" : "#ef4444";

  document
    .getElementById("maintenanceBox")
    .classList.toggle("hidden", appOpen);

  renderAdmins();
  renderMembers();
  loadNFTs();
}

// ADMINS TABLE
function renderAdmins() {
  const table = document.getElementById("adminTable");
  table.innerHTML = "";

  ADMINS.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${a.user}</td><td>${a.role}</td>`;
    table.appendChild(tr);
  });
}

// MEMBERS
window.addMember = function () {
  if (!ROLE_PERMS[currentAdmin.role]?.manageMembers) return;

  const name = document.getElementById("memberName").value.trim();
  const days = Number(document.getElementById("memberDays").value);

  if (!name || !days) return;

  const members = JSON.parse(localStorage.getItem("members") || "{}");
  members[name] = Date.now() + days * 86400000;
  localStorage.setItem("members", JSON.stringify(members));

  renderMembers();
};

function renderMembers() {
  const table = document.getElementById("membersTable");
  table.innerHTML = "";

  const members = JSON.parse(localStorage.getItem("members") || "{}");
  Object.entries(members).forEach(([user, exp]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user}</td>
      <td>${new Date(exp).toLocaleDateString()}</td>
      <td>ACTIVE</td>
      <td><button onclick="removeMember('${user}')">Remove</button></td>
    `;
    table.appendChild(tr);
  });
}

window.removeMember = function (user) {
  const members = JSON.parse(localStorage.getItem("members") || "{}");
  delete members[user];
  localStorage.setItem("members", JSON.stringify(members));
  renderMembers();
};

// NFT DATA
function loadNFTs() {
  fetch("/data/nfts.json")
    .then(r => r.json())
    .then(nfts => {
      const s = summarizeNFTs(nfts);
      document.getElementById("nftSummary").innerHTML =
        `NFT Count: <b>${s.count}</b><br>Total Value: <b>${s.totalValue}</b>`;
    });
    }
