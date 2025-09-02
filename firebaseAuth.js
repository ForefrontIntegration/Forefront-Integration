// firebaseAuth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// 👇 Replace these values with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_IDAIzaSyDOwV2NUiktr-JY8VewTD1tBvsah2q2T6sfirebaseapp.com",
    projectId: "forefront-ugc-subscriptions",
    storageBucket: "forefront-ugc-subscriptions.firebasestorage.app",
    messagingSenderId: "988222732912",
    appId: "1:988222732912:web:151a0b709106dfc67692b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Export for use in your dashboard
export { auth, signOut };
