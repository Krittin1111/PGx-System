window.addEventListener("DOMContentLoaded", () => {
  // Get user info from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    // No user logged in, redirect to login page
    window.location.href = "./login.html";
    return;
  }

  // Display user info
  document.getElementById("welcome").textContent = 
      `Welcome, ${user.firstname} ${user.lastname}!`;

  // Barcode button
  const barcodeBtn = document.getElementById("barcodeBtn");
  barcodeBtn.addEventListener("click", () => {
    window.location.href = "./barcode.html";
  });

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    // Clear sessionStorage and go back to login page
    sessionStorage.clear();
    window.location.href = "./login.html";
  });
});
