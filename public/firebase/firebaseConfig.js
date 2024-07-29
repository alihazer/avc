import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxY4IDoAuwnRsqQZaBMrsqLvF3cGzplIA",
  authDomain: "ravc-2c4eb.firebaseapp.com",
  projectId: "ravc-2c4eb",
  storageBucket: "ravc-2c4eb.appspot.com",
  messagingSenderId: "958644611161",
  appId: "1:958644611161:web:a793c96bacc18ea9d2e948",
  measurementId: "G-3G10Z4Y74R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics};
