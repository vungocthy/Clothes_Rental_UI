import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { firebaseAuth } from "../firebase.config";
import { BASE_URL } from "../constants";
import axios from "axios";

export async function signIn({ email, password }) {
  const auth = firebaseAuth;

  return signInWithEmailAndPassword(auth, email, password);
}

export async function getToken({ email, password }) {
  var response = await axios.post(BASE_URL+'authentications',
  {
    email:email,
    password:password
  });

  return response.data;
}


export async function changePassword({ currentPassword, newPassword }) {
  const auth = firebaseAuth;
  const user = auth.currentUser;

  try {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    const newCredential = await reauthenticateWithCredential(user, credential);
    await updatePassword(newCredential.user, newPassword);
  } catch (e) {
    console.log("Change password failed: ", e);
    throw Error(
      e.code === "auth/wrong-password"
        ? "Current password incorrect."
        : "Password change failed."
    );
  }
}

export async function logout() {
  const auth = firebaseAuth;
  localStorage.removeItem("Token");
  localStorage.removeItem("Role");
  return signOut(auth);
}
