import Modal from "../../utils/modal.js";

export const AddUser = () => {
  const userModal = new Modal("userModal");
  const userModalTrigger = document.getElementById("userModalTrigger");

  userModalTrigger.addEventListener("click", () => {
    userModal.show();
  });

  const form = document.getElementById("addUserForm");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const newUsername = document.getElementById("newUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const membershipType = document.getElementById("membershipType").value;

    const errorMessages = {
      firstName: "First name cannot be empty.",
      lastName: "Last name cannot be empty.",
      email: "Please enter a valid email address.",
      newUsername: "Username cannot be empty.",
      newPassword: "Password must be at least 6 characters.",
      confirmPassword: "Passwords do not match.",
      membershipType: "Membership type must be selected.",
    };

    const inputGroups = {
      firstName: document.getElementById("firstName").closest(".input-group"),
      lastName: document.getElementById("lastName").closest(".input-group"),
      email: document.getElementById("email").closest(".input-group"),
      newUsername: document
        .getElementById("newUsername")
        .closest(".input-group"),
      newPassword: document
        .getElementById("newPassword")
        .closest(".input-group"),
      confirmPassword: document
        .getElementById("confirmPassword")
        .closest(".input-group"),
      membershipType: document
        .getElementById("membershipType")
        .closest(".input-group"),
    };

    let isValid = true;

    Object.keys(inputGroups).forEach((key) => {
      const errorSpan = inputGroups[key].querySelector(".error-message");
      errorSpan.textContent = "";
      inputGroups[key].classList.remove("invalid-feedback");
    });

    if (!firstName) setError("firstName", errorMessages.firstName);
    if (!lastName) setError("lastName", errorMessages.lastName);
    if (!validateEmail(email)) setError("email", errorMessages.email);
    if (!newUsername) setError("newUsername", errorMessages.newUsername);
    if (newPassword.length < 6)
      setError("newPassword", errorMessages.newPassword);
    if (newPassword !== confirmPassword)
      setError("confirmPassword", errorMessages.confirmPassword);
    if (!membershipType)
      setError("membershipType", errorMessages.membershipType);

    if (!isValid) return;

    const data = {
      firstName,
      lastName,
      email,
      newUsername,
      newPassword,
      confirmPassword,
      membershipType,
    };

    console.log("Validated Data:", data);

    fetch("api/addUser.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          console.log("User added successfully:", data.message);
          successMessage.textContent = data.message; // Display the success message from the server
          successMessage.style.display = "block";
          setTimeout(() => {
            successMessage.style.display = "none";
            form.reset();
            userModal.hide();
          }, 2000);
        } else {
          console.error("Error adding user:", data.message);
          errorMessage.textContent = data.message; // Display the error message from the server
          errorMessage.style.display = "block";
          setTimeout(() => {
            errorMessage.style.display = "none";
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Unexpected error:", error.message);
        errorMessage.textContent =
          "An unexpected error occurred. Please try again later.";
        errorMessage.style.display = "block";
        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 2000);
      });

    function setError(field, message) {
      isValid = false;
      const errorSpan = inputGroups[field].querySelector(".error-message");
      errorSpan.textContent = message;
      inputGroups[field].classList.add("invalid-feedback");
    }

    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  });
};