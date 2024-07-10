async function registerUser(user) {
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

const form = document.querySelector("#register-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const user = Object.fromEntries(formData.entries());

  const regex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
  if (!regex.test(user.email)) {
    return alert("Email must end with @stud.noroff.no");
  }

  try {
    const response = await registerUser(user);

    if (!response.ok) {
      return alert("An error occurred while trying to register the user");
    }

    alert("User registered successfully");

    window.location.href = "/src/login/login.html";
  } catch (error) {
    console.error(error);
  }
});
