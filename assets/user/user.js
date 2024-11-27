import Modal from "../../utils/modal.js";
import "../booking/booking.js";

document.addEventListener("DOMContentLoaded", () => {
  const apiEndpoint = "api/get_user_data.php";
  const token = localStorage.getItem("authToken");

  // If no token, stop further execution and show an alert or redirect
  if (!token) {
    window.location.href = `${window.location.origin}/gym/login.html`; // Redirect to login page
    return; // Stop further execution
  }

  fetch(apiEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then((result) => {
      // Update DOM elements with fetched data
      document.getElementById(
        "welcomeMessage"
      ).textContent = `Welcome, ${result.data.first_name} ${result.data.last_name}!`;
      document.getElementById("membershipType").textContent =
        result.data.membership_type || "N/A";
      document.getElementById("referralCode").textContent =
        result.data.referral_code || "N/A";
      document.getElementById("expiryDate").textContent =
        result.data.expiry_date || "N/A";
    })
    .catch((error) => {
      console.error("Error loading user data:", error);
      alert("Failed to load user data. Please try again later.");
    });

  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const referralCodeElement = button
        .closest(".content")
        .querySelector(".title");
      const referralCode = referralCodeElement.textContent.trim();
      const icon = button.querySelector(".icon-copy");

      try {
        await navigator.clipboard.writeText(referralCode);

        icon.classList.remove("fa-regular", "fa-copy");
        icon.classList.add("fa-solid", "fa-check");

        setTimeout(() => {
          icon.classList.remove("fa-solid", "fa-check");
          icon.classList.add("fa-regular", "fa-copy");
        }, 500);
      } catch (err) {
        console.error("Failed to copy: ", err);

        icon.classList.remove("fa-regular", "fa-copy");
        icon.classList.add("fa-solid", "fa-exclamation");

        setTimeout(() => {
          icon.classList.remove("fa-solid", "fa-exclamation");
          icon.classList.add("fa-regular", "fa-copy");
        }, 500);
      }
    });
  });

  // Feedback form modal
  const feedbackModal = new Modal("feedbackModal");
  const feedbackModalTrigger = document.getElementById("feedbackModalTrigger");

  feedbackModalTrigger.addEventListener("click", () => {
    feedbackModal.show();
  });

  // Capture Form Data and Handle Submission
  const feedbackForm = document.getElementById("feedbackForm");
  const successMessage = document.getElementById("successMessage");

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");

    // Check if auth token exists in localStorage
    if (!token) {
      alert("You are not logged in.");
      window.location.href = "login.html";
      return;
    }

    const formData = new FormData(feedbackForm);
    const feedbackData = Object.fromEntries(formData.entries());
    console.log("User Feedback:", feedbackData);
    console.log("User token:", token);

    // Make an API call without sending form data
    fetch("api/send_feedback_email.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach auth token
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        if (result.success) {
          successMessage.style.display = "block";
          setTimeout(() => {
            successMessage.style.display = "none";
            feedbackForm.reset();
            feedbackModal.hide();
          }, 2000);
        } else {
          alert(result.message || "Failed to submit feedback.");
        }
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
      });
  });
});
