// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCsZzmeFn0pxEi8flujZUJSctU5lL_wdhg",
  authDomain: "anti-net.firebaseapp.com",
  projectId: "anti-net",
  storageBucket: "anti-net.appspot.com",
  messagingSenderId: "549984049095",
  appId: "1:549984049095:web:a743b09c914e2d24f82be2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Upload helper
async function uploadFiles(files, folder) {
  const urls = [];
  for (const file of files) {
    const storageRef = storage.ref().child(`${folder}/${Date.now()}_${file.name}`);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();
    urls.push(url);
  }
  return urls;
}

// Main submission function
async function collectData(isAnonymous) {
  const bullyingType = document.querySelector('.type-of-bullying').value;
  const platform = document.querySelector('.platform').value;
  const message = document.querySelector('.text-message').value;
  const dateTime = document.querySelector('.incident-datetime').value;

  if (!bullyingType || !platform || !message) {
    alert("Please fill all required fields.");
    return;
  }

  const imageFiles = document.getElementById('imageInput').files;
  const videoFiles = document.getElementById('videoInput').files;
  const documentFiles = document.getElementById('documentInput').files;

  try {
    const imageUrls = await uploadFiles(imageFiles, "images");
    const videoUrls = await uploadFiles(videoFiles, "videos");
    const documentUrls = await uploadFiles(documentFiles, "documents");

    await db.collection("Reports").add({
      bullyingType,
      platform,
      message,
      anonymous: isAnonymous,
      dateTime: dateTime || new Date().toISOString(),
      imageUrls,
      videoUrls,
      documentUrls,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    showPopupAndRedirect();
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Something went wrong during submission.");
  }
}

// Event Listeners
document.getElementById("submitReport").addEventListener("click", () => collectData(false));
document.getElementById("submitReportAnonymous").addEventListener("click", () => collectData(true));

// Popup function
function showPopupAndRedirect() {
  const popup = document.getElementById("popupMessage");
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
    window.location.href = "#Tree"; // Change to home if needed
  }, 3000);
}

// Optional preview handling
document.getElementById('imageInput').addEventListener('change', function (e) {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = '';
  Array.from(e.target.files).forEach(file => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.width = "100px";
    img.style.margin = "5px";
    preview.appendChild(img);
  });
});

document.getElementById('videoInput').addEventListener('change', function (e) {
  const preview = document.getElementById('videoPreview');
  preview.innerHTML = '';
  const video = document.createElement('video');
  video.src = URL.createObjectURL(e.target.files[0]);
  video.controls = true;
  video.style.width = "200px";
  preview.appendChild(video);
});

document.getElementById('documentInput').addEventListener('change', function (e) {
  const preview = document.getElementById('documentPreview');
  preview.innerHTML = '';
  Array.from(e.target.files).forEach(file => {
    const p = document.createElement('p');
    p.textContent = file.name;
    preview.appendChild(p);
  });
});
