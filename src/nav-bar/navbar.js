import { getCredits } from "../utils.js";

let navBarUrl = "nav-bar/nav-bar.html";
const url = window.location.pathname.includes("index.html")
  ? navBarUrl
  : "../" + navBarUrl;

const getUrl = (url) => {
  return window.location.pathname.includes("index.html") ? url : "../" + url;
};

const isLoggedIn = !!localStorage.getItem("accessToken");

function loadNavbar() {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      if (isLoggedIn) {
        const usernameContainer = document.getElementById("username");
        const logoutButton = document.getElementById("logout-button");
        const username = localStorage.getItem("name");

        usernameContainer.innerHTML = `<a href="${getUrl(
          "profile/profile.html"
        )}">Welcome, ${username}</a>`;
        usernameContainer.setAttribute("class", "");
        logoutButton.setAttribute("class", "btn btn-link");

        // Add an onclick event listener to the logoutButton
        logoutButton.addEventListener("click", function () {
          // Clear the localStorage
          localStorage.clear();

          // Navigate to the home page
          window.location.href = window.location.pathname.includes("index.html")
            ? "index.html"
            : "../index.html";
        });
      }

      // Hide login link if user is already on the login page
      if (window.location.pathname.includes("login.html") || isLoggedIn) {
        const loginLink = document.getElementById("login-link");
        loginLink.style.visibility = "hidden";
      }

      // Change the href if user already is on the home page
      if (window.location.pathname.includes("index.html")) {
        const homeLink = document.getElementById("home-link");
        homeLink.setAttribute("href", "");

        const loginLink = document.getElementById("login-link");
        loginLink.setAttribute("href", "../src/login/login.html");
      }
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

function checkIfLoggedIn() {
  const accessToken = localStorage.getItem("accessToken");

  const isAuthorizedPage =
    window.location.pathname.includes("listing.html") ||
    window.location.pathname.includes("profile.html") ||
    window.location.pathname.includes("create-listing.html");

  // If we are on pages that dont require authorization, we dont need to check if the user is logged in
  if (
    window.location.pathname.includes("login.html") ||
    window.location.pathname.includes("index.html")
  ) {
    return;
  }

  // If the user is not logged in and the page requires authorization, redirect to the login page
  if (!accessToken && isAuthorizedPage) {
    window.location.href = getUrl("login/login.html");
  }
}

async function setAvailableCredits() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return;
  }

  const creditsResponse = await getCredits();

  if (creditsResponse.ok) {
    const data = await creditsResponse.json();
    const creditsContainer = document.getElementById("available-credits");
    creditsContainer.innerHTML = `<p style="color: #e0e0e0; margin-bottom: 0px;">Available credits: ${data?.credits}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  loadNavbar();
  await setAvailableCredits();

  // Check if the user is logged in every second
  setInterval(checkIfLoggedIn, 1000);
});
