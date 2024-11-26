import Modal from "../../utils/modal.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".loginForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const username = usernameInput?.value?.toLowerCase()?.trim();
    const password = passwordInput?.value?.trim();

    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");

    const usernameParent = usernameInput.closest(".input-group");
    const passwordParent = passwordInput.closest(".input-group");

    let isValid = true;

    // Clear previous error messages and remove invalid-feedback class
    usernameError.textContent = "";
    passwordError.textContent = "";
    usernameParent.classList.remove("invalid-feedback");
    passwordParent.classList.remove("invalid-feedback");
    usernameError.style.display = "none";
    passwordError.style.display = "none";

    // Validation logic for empty fields
    if (!username) {
      usernameError.textContent = "Username cannot be empty.";
      usernameError.style.display = "block";
      usernameParent.classList.add("invalid-feedback");
      isValid = false;
    }

    if (!password) {
      passwordError.textContent = "Password cannot be empty.";
      passwordError.style.display = "block";
      passwordParent.classList.add("invalid-feedback");
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters.";
      passwordError.style.display = "block";
      passwordParent.classList.add("invalid-feedback");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const data = {
      username: username,
      password: password,
    };

    console.log("Validated data:", JSON.stringify(data));

    fetch("api/check_login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("Response data:", response);
        if (response.success) {
          window.location.href = response.redirect_url;
        } else {
          passwordError.textContent = response.message;
          passwordError.style.display = "block";
          passwordParent.classList.add("invalid-feedback");
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  //   Forgot Password Page
  const forgotPassModal = new Modal("forgotPassModal");
  const forgotPassModalTrigger = document.getElementById(
    "forgotPassModalTrigger"
  );

  forgotPassModalTrigger.addEventListener("click", () => {
    forgotPassModal.show();
  });

  const forgotPasswordForm = document.getElementById("forgotPassForm");
  forgotPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email").value.trim();

    if (emailInput) {
      const successMessage = document.getElementById("successMessage");
      successMessage.style.display = "block";

      setTimeout(() => {
        successMessage.style.display = "none";
        forgotPasswordForm.reset();
        forgotPassModal.hide();
      }, 2000);
      console.log("Captured Email Address:", emailInput);
    } else {
      console.log("No email address provided.");
      const errorMessage = document.getElementById("email-error");
      errorMessage.textContent = "Email address is required.";
    }
  });
});
