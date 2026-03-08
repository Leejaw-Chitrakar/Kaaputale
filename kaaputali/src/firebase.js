// Firebase configuration for Kaaputale
// Credentials are loaded from .env (never stored in source control)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getPerformance, trace } from "firebase/performance";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

// Example: Log a custom event
logEvent(analytics, "page_view", { page_title: "Homepage" });

// Initialize Performance Monitoring
export const perf = getPerformance(app);

// Example: Measure a custom code trace
const myTrace = trace(perf, "image_load_time");
myTrace.start();
myTrace.stop();

// Custom error logging solution
window.onerror = async (message, source, lineno, colno, error) => {
    try {
        await addDoc(collection(db, "crash_logs"), {
            message: message,
            source: source,
            lineno: lineno,
            colno: colno,
            stack: error ? error.stack : "N/A",
            timestamp: new Date().toISOString(),
        });
        console.log("Error logged to Firestore.");
    } catch (e) {
        console.error("Error sending crash log to Firestore:", e);
    }
    return false; // Prevent default browser error handling
};

export default app;
