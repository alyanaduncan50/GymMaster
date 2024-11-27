import Modal from "../../utils/modal.js";

const editMemberShip = document.getElementById("editMembership");
const renewButton = document.getElementById("renewMemberShip");
const lastRenewField = document.getElementById("editLastRenew");

const editSuccessMessage = document.getElementById("editSuccessMessage");
const editErrorMessage = document.getElementById("editErrorMessage");

function checkLastRenew() {
  const lastRenewValue = lastRenewField.textContent.trim();
  // Check if lastRenewValue is empty or not in a valid format
  if (!lastRenewValue || !/^\d{4}-\d{2}-\d{2}$/.test(lastRenewValue)) {
    console.error("Invalid or missing date:", lastRenewValue);
    renewButton.disabled = true;
    editMemberShip.disabled = true;
    return;
  }

  const lastRenewDate = new Date(lastRenewValue); // Make sure it's in the correct format YYYY-MM-DD
  if (isNaN(lastRenewDate.getTime())) {
    console.error("Invalid date:", lastRenewValue);
    renewButton.disabled = true;
    editMemberShip.disabled = true;
    return;
  }

  const currentDate = new Date();
  const differenceInTime = currentDate.getTime() - lastRenewDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  renewButton.disabled = differenceInDays < 30;
  editMemberShip.disabled = differenceInDays < 30;
}

export const Membership = () => {
  const viewModal = new Modal("viewModal");

  // Event listener for the View button
  document.querySelector(".table tbody").addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("view-btn")) {
      const row = event.target.closest("tr");

      lastRenewField.textContent = row.children[7].textContent.trim();

      checkLastRenew();

      const rowData = {
        firstName: row.children[1].textContent.trim(),
        lastName: row.children[2].textContent.trim(),
        email: row.children[3].textContent.trim(),
        username: row.children[4].textContent.trim(),
        membership: row.children[5].textContent.trim(),
        expiryDate: row.children[7].textContent.trim(),
      };

      // Populate modal with user data
      document.getElementById("editFirstName").textContent = rowData.firstName;
      document.getElementById("editLastName").textContent = rowData.lastName;
      document.getElementById("editEmail").textContent = rowData.email;
      document.getElementById("editUsername").textContent = rowData.username;
      document.getElementById("editLastRenew").textContent = rowData.expiryDate;
      document.getElementById("editMembership").value = rowData.membership;

      // Show the modal
      viewModal.show();
    }
  });

  // Renew Membership button
  document
    .getElementById("renewMemberShip")
    .addEventListener("click", (event) => {
      event.preventDefault();

      const userName = document
        .getElementById("editUsername")
        .textContent.trim();
      const email = document.getElementById("editEmail").textContent;
      const membershipType = document.getElementById("editMembership").value;

      const token = localStorage.getItem("authToken");

      // Only proceed if Renew button is enabled (i.e., membership is expired)
      if (!renewButton.disabled) {
        fetch("api/renew_membership.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token
          },
          body: JSON.stringify({
            userName: userName,
            email: email,
            membershipType: membershipType,
          }),
        })
          .then((response) => response.json()) // Convert to JSON
          .then((result) => {
            if (result.success) {
              const tableBody = document.querySelector(".table tbody");
              const rows = Array.from(tableBody.querySelectorAll("tr")); // Get all rows
              const row = rows.find(
                (tr) =>
                  tr.querySelector("td:nth-child(5)").textContent.trim() ===
                  userName
              );
              if (row) {
                row.querySelector("td:nth-child(6)").textContent =
                  membershipType;
                row.querySelector("td:nth-child(8)").textContent =
                  result.renewalDate;
              }
              console.log(result.message);
              editSuccessMessage.textContent = result.message;
              editSuccessMessage.style.display = "block";
              setTimeout(() => {
                editSuccessMessage.style.display = "none";
                //form.reset();
                viewModal.hide();
              }, 2000);

              //viewModal.hide();
            } else {
              console.error("Error renewing membership: " + result.message);
              editErrorMessage.textContent = result.message; // Display the error message from the server
              editErrorMessage.style.display = "block";
              setTimeout(() => {
                editErrorMessage.style.display = "none";
                viewModal.hide();
              }, 2000);
            }
          })
          .catch((error) => {
            console.error(
              "An error occurred while renewing the membership:",
              error
            );
            editErrorMessage.textContent = error; // Display the error message from the server
            editErrorMessage.style.display = "block";
            setTimeout(() => {
              editErrorMessage.style.display = "none";
            }, 2000);
          });
      }
    });

  // Cancel Membership
  document
    .getElementById("cancelMemberShip")
    .addEventListener("click", (event) => {
      event.preventDefault();

      const username = document.getElementById("editUsername").textContent;
      const email = document.getElementById("editEmail").textContent;

      // Token from localStorage
      const token = localStorage.getItem("authToken");

      fetch("api/cancel_membership.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          email: email,
        }),
      })
        .then((response) => response.json()) // Convert to JSON
        .then((result) => {
          if (result.success) {
            // Remove the row from the table
            const tableBody = document.querySelector(".table tbody");
            const row = Array.from(tableBody.querySelectorAll("tr")).find(
              (tr) =>
                tr
                  .querySelector("td:nth-child(5)") // Target the 5th username column
                  .textContent.trim() === username // Compare with the username
            );

            if (row) {
              row.remove();
            }
            console.log(result.message);
            editSuccessMessage.textContent = result.message;
            editSuccessMessage.style.display = "block";
            setTimeout(() => {
              editSuccessMessage.style.display = "none";
              viewModal.hide();
            }, 2000);
          } else {
            editErrorMessage.textContent = result.message;
            editErrorMessage.style.display = "block";
            setTimeout(() => {
              editErrorMessage.style.display = "none";
              viewModal.hide();
            }, 2000);
            console.log("Error canceling membership: " + result.message);
          }
        })
        .catch((error) => {
          console.error(
            "An error occurred while canceling the membership ",
            error
          );
          editErrorMessage.textContent = error;
          editErrorMessage.style.display = "block";
          setTimeout(() => {
            editErrorMessage.style.display = "none";
            viewModal.hide();
          }, 2000);
        });

      // viewModal.hide();
    });
};
