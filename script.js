const API_URL = "https://leetcode-stats-api.herokuapp.com/";
const CIRCUMFERENCE = 238.76; // 2 * PI * 38

const searchBtn    = document.getElementById("search-btn");
const userInput    = document.getElementById("user-input");

const loadingPanel = document.getElementById("loading-panel");
const errorPanel   = document.getElementById("error-panel");
const resultPanel  = document.getElementById("result-panel");
const errorMsg     = document.getElementById("error-msg");

function showPanel(which) {
  [loadingPanel, errorPanel, resultPanel].forEach(p => p.classList.remove("visible"));
  which.classList.add("visible");
}

function setRing(ringEl, percent) {
  const offset = CIRCUMFERENCE * (1 - percent / 100);
  ringEl.style.strokeDashoffset = offset;
}

async function fetchData(username) {
  showPanel(loadingPanel);

  try {
    const res = await fetch(API_URL + username);
    if (!res.ok) throw new Error("User not found");

    const data = await res.json();
    if (data.status === "error") throw new Error(data.message || "User not found");

    displayData(username, data);
  } catch (err) {
    errorMsg.textContent = `⚠ ${err.message}`;
    showPanel(errorPanel);
  }
}

function displayData(username, data) {
  document.getElementById("res-username").textContent    = username;
  document.getElementById("res-rank").textContent        = data.ranking?.toLocaleString() ?? "—";
  document.getElementById("res-total").textContent       = data.totalSolved ?? "—";
  document.getElementById("res-acceptance").textContent  = data.acceptanceRate != null ? data.acceptanceRate + "%" : "—";
  document.getElementById("res-contribution").textContent = data.contributionPoints ?? "—";

  document.getElementById("easy-count").textContent   = data.easySolved   ?? 0;
  document.getElementById("medium-count").textContent = data.mediumSolved ?? 0;
  document.getElementById("hard-count").textContent   = data.hardSolved   ?? 0;

  const total = data.totalSolved || 1;

  showPanel(resultPanel);

  // Small delay so the animation plays after panel fades in
  setTimeout(() => {
    setRing(document.getElementById("easy-ring"),   (data.easySolved   / total) * 100);
    setRing(document.getElementById("medium-ring"), (data.mediumSolved / total) * 100);
    setRing(document.getElementById("hard-ring"),   (data.hardSolved   / total) * 100);
  }, 80);
}

function handleSearch() {
  const username = userInput.value.trim();
  if (!username) { userInput.focus(); return; }
  fetchData(username);
}

searchBtn.addEventListener("click", handleSearch);
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSearch();
});
