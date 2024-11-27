import Modal from "../../utils/modal.js";
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("bookingSlotDate");
  const bookingSlots = document.querySelectorAll(".booking-slot");
  const errorDiv = document.getElementById("error");
  const successDiv = document.getElementById("success");

  // Booking modal
  const bookSessionModal = new Modal("bookSessionModal");
  const bookSessionModalTrigger = document.getElementById(
    "bookSessionModalTrigger"
  );

  bookSessionModalTrigger.addEventListener("click", () => {
    bookSessionModal.show();
  });

  dateInput.addEventListener("change", () => {
    if (dateInput.value) {
      errorDiv.style.display = "none";
    }
  });

  bookingSlots.forEach((slot) => {
    slot.addEventListener("click", () => {
      const selectedDate = dateInput.value;
      const selectedTime = slot.querySelector(".time").textContent;

      if (selectedDate) {
        errorDiv.style.display = "none";
        const formattedDate = new Date(selectedDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        const token = localStorage.getItem("authToken");

        // Make the API call to send the email
        fetch("api/send_training_session_email.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: formattedDate,
            time: selectedTime,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              successDiv.textContent = `Your training session has been booked for ${formattedDate} at ${selectedTime} ${data.message}`;
              successDiv.style.display = "block";
              bookingSlots.forEach((s) => s.classList.remove("active"));
              setTimeout(() => {
                successDiv.style.display = "none";
                bookSessionModal.hide();
              }, 9000);
            } else {
              successDiv.style.display = "none";
              errorDiv.style.display = "block";
              errorDiv.textContent =
                "There was an issue booking your session. Please try again.";
              // Clear active class on error
              bookingSlots.forEach((s) => s.classList.remove("active"));
            }
          })
          .catch((error) => {
            successDiv.style.display = "none";
            errorDiv.style.display = "block";
            errorDiv.textContent = "An error occurred. Please try again later";
            console.error("Error booking session:", error);
          });

        console.log(
          `Selected Date: ${formattedDate}, Selected Time: ${selectedTime}`
        );

        bookingSlots.forEach((s) => s.classList.remove("active"));
        slot.classList.add("active");
      } else {
        successDiv.style.display = "none";
        errorDiv.style.display = "block";
        errorDiv.textContent =
          "Please select a date before choosing a time slot.";
      }
    });
  });
});
