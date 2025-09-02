import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOwV2NUiktr-JY8VewTD1tBvsah2q2T6s",
    authDomain: "https://www.forefrontintegration.com",
    projectId: "forefront-ugc-subscriptions",
    storageBucket: "forefront-ugc-subscriptions.firebasestorage.app",
    messagingSenderId: "988222732912",
    appId: "1:988222732912:web:151a0b709106dfc67692b5",
    measurementId: "G-ZXHZ4T2VKS"
};

const appId = "ugc-hub-app";
const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
const firebaseCustomConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;

let auth;
let db;
let userId = '';

// Initialize Firebase services and set up auth listener
async function initializeFirebase() {
    try {
        const app = initializeApp(firebaseCustomConfig);
        const analytics = getAnalytics(app);
        auth = getAuth(app);
        db = getFirestore(app);
        setLogLevel('debug');

        onAuthStateChanged(auth, async (user) => {
            if (user && user.isAnonymous === false) {
                // User is signed in
                const userEmailDisplay = document.getElementById('user-email');
                const userDisplayId = document.getElementById('user-id-display');
                userId = user.uid;
                if (userEmailDisplay) userEmailDisplay.textContent = user.email || 'N/A';
                if (userDisplayId) userDisplayId.textContent = userId;
            } else {
                // No user is signed in, redirect if not on a login/signup page
                if (window.location.pathname !== '/index.html' && window.location.pathname !== '/signup.html') {
                    window.location.href = './index.html';
                }
            }
        });

        // Set up logout button functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await signOut(auth);
                    window.location.href = './index.html';
                } catch (error) {
                    console.error("Logout error:", error);
                }
            });
        }
    } catch (error) {
        console.error("Firebase initialization or auth error:", error);
    }
}

// Function to start the Google OAuth flow
export async function connectWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        // User's info is in result.user
        const user = result.user;
        console.log("Successfully connected with Google:", user);
        // You can now redirect the user or update the UI
        window.location.href = './tier1.html';
    } catch (error) {
        console.error("Google OAuth error:", error);
    }
}

// Global functions for other pages to use
window.connectWithGoogle = connectWithGoogle;

// Initialize Firebase when the script loads
initializeFirebase();
