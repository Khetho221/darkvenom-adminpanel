import { ADMINS } from "./config.js";
import { summarizeNFTs } from "./nft.js";

let appOpen = true;
let currentUser = null;

window.login = function () {
  const u = loginUser.value;
  const p = loginPass.value;

  const found = ADMINS.find(a => a.user === u && a.pass === p);
  if (!found) {
    loginMsg.textContent = "Invalid credentials";
    return;
  }

  currentUser = found;
  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");
  render();
};

function render() {
  appStatus.innerHTML = appOpen
    ? "<span class='open'>OPEN</span>"
    : "<span class='closed'>CLOSED</span>";

  adminTable.innerHTML = "";
  ADMINS.forEach(a => {
    adminTable.innerHTML += `<tr><td>${a.user}</td><td>${a.role}</td></tr>`;
  });

  loadNFTs();
}

window.toggleApp = function () {
  if (currentUser.role === "OWNER" || currentUser.role === "VIP") {
    appOpen = !appOpen;
    render();
  }
};

function loadNFTs() {
  fetch("/data/nfts.json")
    .then(r => r.json())
    .then(nfts => {
      const summary = summarizeNFTs(nfts);
      nftSummary.innerHTML =
        `Count: ${summary.count}<br>Total Value: ${summary.totalValue}`;
    });
}
