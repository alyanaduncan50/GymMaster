import { AddUser } from "./addUser.js";
import { Membership } from "./membership.js";
import { BASE_URL } from "../../config.js";

// Fetch users and render table
async function fetchUsers() {
  const searchInput = document.getElementById("searchInput");
  const filterMemberShip = document.getElementById("filterMemberShip");
  const tableBody = document.querySelector(".table tbody");

  const searchValue = searchInput ? searchInput.value.trim() : "";
  const filterValue = filterMemberShip ? filterMemberShip.value : "";

  try {
    // Construct a valid URL
    const token = localStorage.getItem("authToken");

    // If no token, stop further execution and show an alert or redirect
    if (!token) {
      window.location.href = `${BASE_URL}login.html`; // Redirect to login page
      return; // Stop further execution
    }

    const baseUrl = `${BASE_URL}api/get_users.php`;

    const url = new URL(baseUrl);

    // Add query parameters
    if (searchValue) url.searchParams.set("search", searchValue);
    if (filterValue) url.searchParams.set("filterMembership", filterValue);
    //console.log(url);
    // Fetch data
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      renderTable(result.data, tableBody);
    } else if (result.code && result.code === "401") {
      window.location.href = result.redirect_url || `${BASE_URL}login.html`;
    } else {
      console.error(
        "Error fetching user data:",
        result.message || "Invalid response structure"
      );
      renderTable([], tableBody); // Render empty table if no data
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    renderErrorRow(tableBody, "Error Loading Data");
  }
}

// Render table with user data
function renderTable(users, tableBody) {
  tableBody.innerHTML = ""; // Clear existing rows

  if (users.length === 0) {
    renderErrorRow(tableBody, "No Records Found");
    return;
  }

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.first_name}</td>
      <td>${user.last_name}</td>
      <td>${user.email}</td>
      <td>${user.username}</td>
      <td>${user.membership_type}</td>
      <td>${user.referral_code}</td>
      <td>${user.last_renewed}</td>
      <td>
        <div class="table-action">
          <span class="fa-solid fa-eye btn-view view-btn" data-id="${
            user.id
          }"></span>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Render an error or empty message row
function renderErrorRow(tableBody, message) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="9" class="text-center">${message}</td>
    </tr>
  `;
}

// Add event listeners for search and filter
function addEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const filterMemberShip = document.getElementById("filterMemberShip");

  if (searchInput) {
    searchInput.addEventListener("input", () => fetchUsers());
  }

  if (filterMemberShip) {
    filterMemberShip.addEventListener("change", () => fetchUsers());
  }
}

// Initialize the functionality
document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
  addEventListeners();
  AddUser();
  Membership();
});
