import Modal from "./utils/modal.js";

const editMemberShip = document.getElementById("editMembership");
const renewButton = document.getElementById("renewMemberShip");
const lastRenewField = document.getElementById("editLastRenew");

function checkLastRenew() {
  const lastRenewValue = lastRenewField.textContent.trim();
  // Parse lastRenew date
  const lastRenewDate = new Date(lastRenewValue.split("-").reverse().join("-"));
  const currentDate = new Date();

  // Calculate the difference in days
  const differenceInTime = currentDate.getTime() - lastRenewDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  renewButton.disabled = differenceInDays < 30;
  editMemberShip.disabled = differenceInDays < 30;
}

export const UserMembership = () => {
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

      const membership = document.getElementById("editMembership").value;
      console.log("membership", membership);
      // viewModal.hide();
    });

  // Cancel Membership
  document
    .getElementById("cancelMemberShip")
    .addEventListener("click", (event) => {
      event.preventDefault();

      const username = document.getElementById("editUsername").textContent;

      console.log(`Membership cancelled for ${username}.`);
      // viewModal.hide();
    });
};
