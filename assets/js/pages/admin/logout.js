document.getElementById("logoutButton").addEventListener("click", function () {
  fetch("api/logout.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        localStorage.removeItem("authToken");
        window.location.href = "/gym/login.html";
      } else {
        alert("Error logging out: " + result.message);
      }
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out.");
    });
});
