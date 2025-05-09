function handleSubmit(isAnonymous) {
  const message = document.querySelector('.text-message').value.trim();
  const type = document.querySelector('.type-of-bullying').value;
  const platform = document.querySelector('.platform').value;
  const datetime = document.querySelector('.incident-datetime').value;

  // Validation: Check required fields
  if (!message || !type || !platform || !datetime) {
    alert("Please fill in all required fields before submitting.");
    return; // Stop further execution
  }

  // Show success popup
  const popup = document.getElementById('popupMessage');
  popup.style.display = 'block';

  // Optional: scroll to the popup
  // popup.scrollIntoView({ behavior: 'smooth' });

  // Redirect after 3 seconds
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);
}

// Attach listeners with preventDefault to avoid unwanted redirect
document.getElementById('submitReport').addEventListener('click', function (e) {
  e.preventDefault();
  handleSubmit(false);
});

document.getElementById('submitReportAnonymous').addEventListener('click', function (e) {
  e.preventDefault();
  handleSubmit(true);
});





// database connection

