import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithCustomToken,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOwV2NUiktr-JY8VewTD1tBvsah2q2T6s",
    authDomain: "forefront-ugc-subscriptions.firebaseapp.com",
    projectId: "forefront-ugc-subscriptions",
    storageBucket: "forefront-ugc-subscriptions.firebasestorage.app",
    messagingSenderId: "988222732912",
    appId: "1:988222732912:web:151a0b709106dfc67692b5",
    measurementId: "G-ZXHZ4T2VKS"
};

const appId = "ugc-hub-app";
const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
const firebaseCustomConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase services and export the auth and db objects
const app = initializeApp(firebaseCustomConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
setLogLevel('debug');

let userId = '';

// Handle the initial sign-in logic when the script is loaded
async function handleInitialSignIn() {
    try {
        if (initialAuthToken) {
            // Sign in with the provided custom token
            await signInWithCustomToken(auth, initialAuthToken);
            console.log("Signed in with custom token.");
        } else {
            // Sign in anonymously as a fallback
            await signInAnonymously(auth);
            console.log("Signed in anonymously.");
        }
    } catch (error) {
        console.error("Initial sign-in failed:", error);
    }
}

// Function to start the Google OAuth flow
export async function connectWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Successfully connected with Google:", user);
        window.location.href = './tier1.html';
    } catch (error) {
        console.error("Google OAuth error:", error);
    }
}

// Set up the state change listener to update UI or redirect
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
        const path = window.location.pathname;
        if (path.endsWith('login.html') || path.endsWith('index.html')) {
            // Do not redirect on these pages
        } else {
            // Redirect to a specific page for anonymous or unauthenticated users
            window.location.href = './login.html';
        }
    }
});

// Set up logout button functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = './login.html';
        } catch (error) {
            console.error("Logout error:", error);
        }
    });
}

// Handle the initial sign-in attempt
handleInitialSignIn();
