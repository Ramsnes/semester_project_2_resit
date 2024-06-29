import { getCredits } from "../utils.js";

var totalCredits = null;

async function getListingById(id) {
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/listings/${id}?_bids=true`,
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

async function submitBid(id, amount) {
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/listings/${id}/bids`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount,
        }),
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

function renderListing(listing) {
  const bidsContainer = document.querySelector("#bids-container");
  const listingContainer = document.querySelector("#listing-container");
  listingContainer.innerHTML = ""; // Clear previous listings
  const image = listing?.media.length > 0 ? listing.media[0] : null;

  // idPage render
  const listingHtml = `
  <div class="card" style="width: 20rem;">
        <h1>${listing.title}</h1>
        <p>${listing.description ?? ""}</p>
        ${
          image
            ? `<img src="${image}" alt="Listing image" class="img-fluid" style="height: 300px; object-fit: contain;" />`
            : ""
        }
        </div>
        `;

  for (const bid of listing?.bids) {
    const bidElement = document.createElement("div");
    const bidHtml = `
    <div class="card" style="width: 18rem;">
          <p>Bid Amount: ${bid.amount}</p>
          <p>Bidder Name: ${bid.bidderName}</p>
          </div>
          `;
    bidElement.innerHTML = bidHtml;
    bidsContainer.appendChild(bidElement);
  }

  listingContainer.innerHTML = listingHtml;
}

function renderCredits(credits) {
  const creditsContainer = document.querySelector("#credits-container");
  const creditsHtml = `
            <p>Total credits: ${credits}</p>
    `;
  creditsContainer.innerHTML = creditsHtml;
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const response = await getListingById(id);

  if (!response.ok) {
    alert("Something went wrong fetching listing");
  }

  if (response.ok) {
    const listing = await response.json();
    renderListing(listing);
  }

  const creditsResponse = await getCredits();

  if (creditsResponse.ok) {
    const data = await creditsResponse.json();
    totalCredits = data?.credits;
    renderCredits(data?.credits);
  }
});

const form = document.querySelector("#submit-bid-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const amount = formData.get("amount");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (+amount > totalCredits) {
    return alert("You do not have enough credits to submit this bid");
  }

  const response = await submitBid(id, +amount);

  if (!response.ok) {
    return alert("Something went wrong submitting bid");
  }

  location.reload();
});
