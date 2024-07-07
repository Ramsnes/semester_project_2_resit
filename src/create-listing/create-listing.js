import { isValidUrl } from "../utils.js";

async function createListing(data) {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/listings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

const form = document.getElementById("create-listing-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (!data.title) {
    return alert("Title is required");
  }

  if (!data.endsAt) {
    return alert("End date is required");
  }

  const currentDate = new Date();
  const selectedDate = new Date(data.endsAt);

  if (currentDate > selectedDate) {
    return alert("End date must be in the future");
  }

  if (data.media && !isValidUrl(data.media)) {
    return alert("Invalid media URL");
  }

  const listingData = {
    title: data.title,
    description: data.description || undefined,
    media: data.media ? [data.media] : undefined,
    tags: data.tags ? data.tags.split(",").filter(Boolean) : undefined,
    endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : undefined,
  };

  try {
    const response = await createListing(listingData);

    if (!response.ok) {
      return alert("Something went wrong");
    }

    alert("Listing created successfully");
    window.location.href = "/";
  } catch (error) {
    console.error(error);
  }
});
