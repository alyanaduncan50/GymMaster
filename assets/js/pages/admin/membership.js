import Modal from "../../utils/modal.js";

const editMemberShip = document.getElementById("editMembership");
const renewButton = document.getElementById("renewMemberShip");
const lastRenewField = document.getElementById("editLastRenew");

function checkLastRenew() {
  const lastRenewValue = lastRenewField.textContent.trim();
  console.log("lastRenewValue ", lastRenewValue);
  // Check if lastRenewValue is empty or not in a valid format
  if (!lastRenewValue || !/^\d{4}-\d{2}-\d{2}$/.test(lastRenewValue)) {
    console.error("Invalid or missing date:", lastRenewValue);
    renewButton.disabled = true;
    editMemberShip.disabled = true;
    return; // Exit function if date is invalid or empty
  }

  // Parse the lastRenew date manually using Date.parse() or Date constructor
  const lastRenewDate = new Date(lastRenewValue); // Make sure it's in the correct format YYYY-MM-DD
  if (isNaN(lastRenewDate.getTime())) {
    console.error("Invalid date:", lastRenewValue);
    renewButton.disabled = true;
    editMemberShip.disabled = true;
    return;
  }

  const currentDate = new Date();
  // Calculate the difference in days
  const differenceInTime = currentDate.getTime() - lastRenewDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  console.log("differenceInDays ", differenceInDays);
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

      // Only proceed if Renew button is enabled (i.e., membership is expired)
      if (!renewButton.disabled) {
        fetch("api/renew_membership.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: userName,
            email: email,
            membershipType: membershipType,
          }),
        })
          .then((response) => response.json()) // Convert to JSON
          .then((result) => {
            console.log(result);
            if (result.success) {
              alert("Membership renewed successfully!");
              // You can update the UI or reload the data after renewal
              viewModal.hide(); // Close the modal after successful renewal
              // Optionally, you can refresh the user table here
            } else {
              alert("Error renewing membership: " + result.message);
            }
          })
          .catch((error) => {
            console.error("Error renewing membership:", error);
            alert("An error occurred while renewing the membership.");
          });
      }
      // viewModal.hide();
    });

  // Cancel Membership
  document
    .getElementById("cancelMemberShip")
    .addEventListener("click", (event) => {
      //alert("here");
      event.preventDefault();

      const username = document.getElementById("editUsername").textContent;
      const email = document.getElementById("editEmail").textContent;

      console.log(`Membership cancelled for ${username}.`);

      fetch("api/cancel_membership.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
        }),
      })
        .then((response) => response.json()) // Convert to JSON
        .then((result) => {
          console.log(result);
          if (result.success) {
            alert("Membership cancelled successfully!");
            viewModal.hide(); // Close the modal after cancellation
          } else {
            alert("Error canceling membership: " + result.message);
          }
        })
        .catch((error) => {
          console.error("Error canceling membership:", error);
          alert("An error occurred while canceling the membership.");
        });

      // viewModal.hide();
    });
};
