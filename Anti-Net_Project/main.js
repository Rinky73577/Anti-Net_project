function handleSubmit(isAnonymous) {
  const message = document.querySelector('.text-message').value.trim();
  const type = document.querySelector('.type-of-bullying').value;
  const platform = document.querySelector('.platform').value;
  const datetime = document.querySelector('.incident-datetime').value;

  if (!message || !type || !platform || !datetime) {
    alert("Please fill in all required fields before submitting.");
    return;
  }


    // Prepare data
    const reportData = {
      message,
      typeOfBullying: type,
      platform,
      datetime,
      isAnonymous,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
  firebase.firestore().collection('reports')
  .add(reportData)
  .then(() => {
    const popup = document.getElementById('popupMessage');
    popup.style.display = 'block';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  })
  .catch((error) => {
    console.error("Error submitting report:", error);
    alert("Failed to submit report. Please try again.");
  });
}

// Attach listeners
document.getElementById('submitReport').addEventListener('click', function (e) {
  e.preventDefault();
  handleSubmit(false);
});

document.getElementById('submitReportAnonymous').addEventListener('click', function (e) {
  e.preventDefault();
  handleSubmit(true);
});
