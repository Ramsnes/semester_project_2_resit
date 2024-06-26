export async function getCredits() {
  const username = localStorage.getItem("name");

  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/profiles/${username}/credits`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
