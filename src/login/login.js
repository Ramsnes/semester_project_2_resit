async function login(data) {
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

const form = document.querySelector("#login-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await login(data);

    if (response.status === 401 || !response.ok) {
      return alert("Wrong email or password");
    }

    const result = await response.json();

    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("name", result.name);
    localStorage.setItem("avatarUrl", result?.avatar);

    window.location.href = "/src/index.html";
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");

  // If you already are logge din, redirect to the home page
  if (accessToken) {
    window.location.href = "/src/index.html";
  }
});
