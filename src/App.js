import "./App.css";
import { useState } from "react";

import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

initializeApp({
  apiKey: "AIzaSyCSrpOw6MKw7iCIdvTsqaHy3O39yrP4y3I",
  authDomain: "fir-message-app-603d9.firebaseapp.com",
  projectId: "fir-message-app-603d9",
  storageBucket: "fir-message-app-603d9.appspot.com",
  messagingSenderId: "365677646337",
  appId: "1:365677646337:web:19d5afebe9c1f44b11e600",
  measurementId: "G-C39E3X1S2K",
});

const auth = getAuth();
const provider = new GoogleAuthProvider();

function googlePopup() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFormResult(result);
      const token = credential.accessToken;
      const user = result.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

function SignIn() {
  return <button onClick={googlePopup}>Sign in with Google</button>;
}
function signOutUser() {
  signOut(auth);
}
function SignOut() {
  return (
    <button className="logOutButton" onClick={signOutUser}>
      SIGN OUT
    </button>
  );
}

function getProfilePicUrl() {
  return (
    auth.currentUser.photoURL ||
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
  );
}

function getUserName() {
  return auth.currentUser.displayName;
}

function Header() {
  return (
    <div className="header">
      <img className="userPhoto" src={`${getProfilePicUrl()}`} />
      <p className="userName">{getUserName()}</p>
      <SignOut />
    </div>
  );
}
function App() {
  const [user] = useAuthState(auth);

  return <div className="App">{user ? <Header /> : <SignIn />}</div>;
}

export default App;
