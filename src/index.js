async function search(data) {
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/listings?_tag=${data?.toLowerCase()}&_active=true`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

function renderNoResults() {
  const container = document.querySelector("#listings-list");
  container.innerHTML = "";

  const noResultsText = document.createElement("p");
  noResultsText.textContent = "No listings found.";
  container.appendChild(noResultsText);
}

function renderListingsResults(listings) {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const container = document.querySelector("#listings-list");

  // Resets old results - plus ables user to search again
  container.innerHTML = "";

  for (const listing of listings) {
    let listItem = document.createElement("li");
    listItem.setAttribute("class", "list-group-item");

    let listItemContainer = null;

    // If we are logged in we should navigate to each listing when clicking on it
    // If we are not logged in we should not navigate to the listing so we wrap the listing in a div
    if (isLoggedIn) {
      listItemContainer = document.createElement("a");
      listItemContainer.href = `./src/listing/listing.html?id=${listing.id}`;
    } else {
      listItemContainer = document.createElement("div");
    }

    listItemContainer.innerHTML = `
    <div class="card container-fluid" style="width: 18rem;">
    ${
      listing?.media
        ? `<img src="${listing.media}" alt="Listing image" class="img-fluid" />`
        : ""
    }
    <div class="body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description}</p>
            <p class="card-text">Bids: ${listing?._count?.bids || 0}</p>
            </div>
    `;
    listItem.appendChild(listItemContainer);
    container.appendChild(listItem);
  }
}

const form = document.querySelector("#search-form");

// Form submission when we search for listings
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const tag = formData.get("tag");

  const response = await search(tag);

  if (!response.ok) {
    alert("Something went wrong searching for listings");
  }

  const result = await response.json();

  if (result && result?.length > 0) {
    return renderListingsResults(result);
  } else {
    return renderNoResults();
  }
});
