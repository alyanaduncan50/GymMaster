import { BASE_URL } from "../../config.js";

document.addEventListener("DOMContentLoaded", () => {
  const apiEndpoint = "api/get_user_data.php";
  const token = localStorage.getItem("authToken");

  // If no token, stop further execution and show an alert or redirect
  if (!token) {
    window.location.href = `${BASE_URL}login.html`; // Redirect to login page
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
      document.getElementById("referralCode").textContent =
        result.data.referral_code || "N/A";
    })
    .catch((error) => {
      console.error("Error loading user data:", error);
      alert("Failed to load user data. Please try again later.");
    });
});
