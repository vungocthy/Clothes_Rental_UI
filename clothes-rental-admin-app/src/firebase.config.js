import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyB3dDVx4u3UXLOjgkuNZyswIm_1QCgOATQ",
  authDomain: "fir-b006c.firebaseapp.com",
  projectId: "fir-b006c",
  storageBucket: "fir-b006c.appspot.com",
  appId: "1:451342239501:web:31abec51b2251710719244",
});

export const firestore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
