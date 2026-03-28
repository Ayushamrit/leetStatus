const searchBtn = document.getElementById("search-btn");
const usernameInput = document.getElementById("user-input");

const easyLabel = document.getElementById("easy-label");
const mediumLabel = document.getElementById("medium-label");
const hardLabel = document.getElementById("hard-label");

const easyCircle = document.getElementById("easy-circle");
const mediumCircle = document.getElementById("medium-circle");
const hardCircle = document.getElementById("hard-circle");

const statsCard = document.querySelector(".stats-card");

const API_URL = "https://leetcode-stats-api.herokuapp.com/";

searchBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Enter username");
        return;
    }

    fetchData(username);
});

async function fetchData(username) {
    try {
        statsCard.innerHTML = "Loading...";

        const response = await fetch(API_URL + username);

        if (!response.ok) {
            throw new Error("User not found");
        }

        const data = await response.json();

        displayData(data);

    } catch (error) {
        statsCard.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

function displayData(data) {
    let total = data.totalSolved;

    easyLabel.textContent = data.easySolved;
    mediumLabel.textContent = data.mediumSolved;
    hardLabel.textContent = data.hardSolved;

    let easyPercent = (data.easySolved / total) * 100;
    let mediumPercent = (data.mediumSolved / total) * 100;
    let hardPercent = (data.hardSolved / total) * 100;

    easyCircle.style.setProperty("--progress-degree", easyPercent + "%");
    mediumCircle.style.setProperty("--progress-degree", mediumPercent + "%");
    hardCircle.style.setProperty("--progress-degree", hardPercent + "%");

    statsCard.innerHTML = `
        <p>Total Solved: ${data.totalSolved}</p>
        <p>Ranking: ${data.ranking}</p>
        <p>Acceptance Rate: ${data.acceptanceRate}%</p>
    `;
}