import { getCredits, isValidUrl } from "../utils.js";

async function updateAvatar(url) {
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("name");

  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/profiles/${username}/media`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          avatar: url,
        }),
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

const form = document.getElementById("update-avatar");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const url = formData.get("avatarUrl");

  if (!isValidUrl(url)) {
    return alert("Please provide a valid avtar url");
  }

  const response = await updateAvatar(url);

  if (!response.ok) {
    return alert("Something went wrong updating the avatar");
  }

  const data = await response.json();
  const updatedUrl = data.avatar;

  localStorage.setItem("avatarUrl", updatedUrl);

  const avatarImage = document.getElementById("avatar-image");
  avatarImage.src = updatedUrl;

  const avatarUrlInput = document.getElementById("avatar-url");
  avatarUrlInput.value = "";
});

document.addEventListener("DOMContentLoaded", async () => {
  const response = await getCredits();

  if (!response.ok) {
    alert("Something went wrong fetching credits");
  }

  const data = await response.json();

  const creditsContainer = document.getElementById("credits-container");
  creditsContainer.innerHTML = `
        <p>Credits: <span id="credits">${data.credits}</span></p>
    `;

  const avatarImage = document.getElementById("avatar-image");
  const avatarUrl = localStorage.getItem("avatarUrl");

  if (avatarUrl && avatarUrl !== "null") {
    avatarImage.src = avatarUrl;
  }
});
