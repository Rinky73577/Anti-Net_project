// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCsZzmeFn0pxEi8flujZUJSctU5lL_wdhg",
    authDomain: "anti-net.firebaseapp.com",
    projectId: "anti-net",
    storageBucket: "anti-net.appspot.com",
    messagingSenderId: "549984049095",
    appId: "1:549984049095:web:a743b09c914e2d24f82be2"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  // Common function to upload files and return URLs
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
  
  // Main submit function
  async function collectData(isAnonymous) {
    const bullyingType = document.querySelector('.type-of-bullying').value;
    const platform = document.querySelector('.platform').value;
    const message = document.querySelector('.text-message').value;
    const dateTime = document.querySelector('.submit-report-as').value;
  
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
  
  // Event listeners
  document.getElementById("submitReport").addEventListener("click", () => collectData(false));
  document.getElementById("submitReportAnonymous").addEventListener("click", () => collectData(true));
  