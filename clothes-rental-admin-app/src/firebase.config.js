import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyD8jIG3rxybg8_SsskVhiHV8K6dBOCgNvk",
  authDomain: "clothes-rental-app.firebaseapp.com",
  projectId: "clothes-rental-app",
  storageBucket: "clothes-rental-app.appspot.com",
  appId: "1:659100578167:web:2e597be08644acea7ab172",
});

export const firestore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
