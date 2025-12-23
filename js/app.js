import { ADMINS } from "./config.js";
import { summarizeNFTs } from "./nft.js";
import "./theme.js";

let currentAdmin=null;
let maintenance=localStorage.getItem("maintenance")==="true";

function generateKey(){return Math.random().toString(36).substring(2,10).toUpperCase();}
function formatDate(ts){return new Date(ts).toISOString().split("T")[0];}

// LOGIN + SESSION
window.login=function(){
  const u=username.value.trim(), p=password.value.trim();
  const found=ADMINS.find(a=>a.user===u&&a.pass===p);
  if(!found){loginMsg.textContent="Invalid login";return;}
  currentAdmin=found;
  localStorage.setItem("adminSession",found.user);
  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");
  render();
};

const savedAdmin=localStorage.getItem("adminSession");
if(savedAdmin){
  const found=ADMINS.find(a=>a.user===savedAdmin);
  if(found){
    currentAdmin=found;
    loginBox.classList.add("hidden");
    dashboard.classList.remove("hidden");
    render();
  }
}

// MAINTENANCE
window.toggleApp=function(){
  maintenance=!maintenance;
  localStorage.setItem("maintenance",maintenance);
  render();
};

// MEMBERS
window.addMember=function(){
  const user=memberName.value.trim();
  if(!user)return;
  const members=JSON.parse(localStorage.getItem("members")||"{}");
  const key=generateKey();
  members[user]={key,expires:Date.now()+300000,suspended:false,locked:false,tier:"STANDARD"};
  localStorage.setItem("members",JSON.stringify(members));
  keyOutput.classList.remove("hidden");
  keyOutput.innerHTML=`KEY: <b>${key}</b><br>Expires in 5 minutes`;
  renderMembers();
};

window.extendUser=function(u){
  const i=document.getElementById(`date-${u}`);
  if(!i||!i.value)return;
  const m=JSON.parse(localStorage.getItem("members")||"{}");
  m[u].expires=new Date(i.value).getTime();
  localStorage.setItem("members",JSON.stringify(m));
  renderMembers();
};

window.suspendUser=function(u){
  const m=JSON.parse(localStorage.getItem("members")||"{}");
  m[u].suspended=!m[u].suspended;
  localStorage.setItem("members",JSON.stringify(m));
  renderMembers();
};

window.removeMember=function(u){
  if(!confirm("Remove user?"))return;
  const m=JSON.parse(localStorage.getItem("members")||"{}");
  delete m[u];
  localStorage.setItem("members",JSON.stringify(m));
  renderMembers();
};

// EARNINGS (OWNER ONLY)
window.saveEarnings=function(){
  const site=Number(siteEarning.value||0);
  const apk=Number(apkEarning.value||0);
  localStorage.setItem("earnings",JSON.stringify({site,apk}));
  renderEarnings();
};

function renderEarnings(){
  const e=JSON.parse(localStorage.getItem("earnings")||"{}");
  siteEarning.value=e.site||0;
  apkEarning.value=e.apk||0;
  totalEarning.textContent=(e.site||0)+(e.apk||0);
}

function renderEarningsVisibility(){
  if(!earningsCard)return;
  earningsCard.style.display=currentAdmin.role==="OWNER"?"block":"none";
}

function renderMembers(){
  membersTable.innerHTML="";
  const m=JSON.parse(localStorage.getItem("members")||"{}");
  const now=Date.now();
  Object.entries(m).forEach(([u,d])=>{
    const expired=now>d.expires;
    membersTable.innerHTML+=`
<tr>
<td>${u}</td>
<td>${d.suspended?"SUSPENDED":expired?"EXPIRED":"ACTIVE"}</td>
<td>${d.key}</td>
<td>
<button onclick="suspendUser('${u}')">${d.suspended?"Unsuspend":"Suspend"}</button>
<button onclick="removeMember('${u}')">Remove</button>
</td>
<td>
<input type="date" id="date-${u}" value="${formatDate(d.expires)}">
<button onclick="extendUser('${u}')">Save</button>
</td>
</tr>`;
  });
}

function render(){
  appStatus.textContent=maintenance?"MAINTENANCE":"OPEN";
  maintenanceBox.classList.toggle("hidden",!maintenance);

  fetch("/data/nfts.json").then(r=>r.json()).then(n=>{
    const s=summarizeNFTs(n);
    nftSummary.innerHTML=`NFTs: ${s.count}<br>Total: ${s.totalValue}`;
  });

  renderMembers();
  renderEarnings();
  renderEarningsVisibility();
}
