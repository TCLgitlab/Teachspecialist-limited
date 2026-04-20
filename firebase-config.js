// Firebase configuration for TechSpecialist Careers
const firebaseConfig = {
  apiKey: "AIzaSyDa9LbXidgOEW0QVA3sptHiZ2Fh1UTa3lo",
  authDomain: "techspecialist-careers.firebaseapp.com",
  projectId: "techspecialist-careers",
  storageBucket: "techspecialist-careers.firebasestorage.app",
  messagingSenderId: "68286942864",
  appId: "1:68286942864:web:06748d637d7422f0ccd215",
  measurementId: "G-0G1BLVF72L"
};

// Initialize Firebase (CDN approach)
function initializeFirebase() {
  return new Promise((resolve, reject) => {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      resolve(firebase);
    } else {
      // Load Firebase SDK if not already loaded
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
      script.onload = () => {
        firebase.initializeApp(firebaseConfig);
        resolve(firebase);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
}

// Initialize Firebase services
async function getFirebaseServices() {
  await initializeFirebase();

  return {
    auth: firebase.auth(),
    firestore: firebase.firestore(),
    storage: firebase.storage()
  };
}