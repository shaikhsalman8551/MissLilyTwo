import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ IMPORTANT: FIREBASE SETUP INSTRUCTIONS
// ================================================
// 1. Go to: https://console.firebase.google.com
// 2. Create a new project called "MissLily"
// 3. In Project Settings, copy your config
// 4. Replace the values below with your actual Firebase credentials
// 5. Enable these services in Firebase Console:
//    - Firestore Database (Start in test mode for development)
//    - Cloud Storage (for product images)
//    - Authentication (Email/Password)
//    - Hosting (for free deployment)

// Use Vite env variables (prefix VITE_) so credentials are not committed.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {

    throw new Error('Firebase configuration is missing. Please check your .env.local file.');
}

const app = initializeApp(firebaseConfig);
// Helpful debug log to confirm which Firebase project the client is using

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;