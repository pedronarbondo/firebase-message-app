import "./App.css";
import { useState, useRef } from "react";

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
  getDocs,
} from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const app = initializeApp({
  apiKey: "AIzaSyCSrpOw6MKw7iCIdvTsqaHy3O39yrP4y3I",
  authDomain: "fir-message-app-603d9.firebaseapp.com",
  projectId: "fir-message-app-603d9",
  storageBucket: "fir-message-app-603d9.appspot.com",
  messagingSenderId: "365677646337",
  appId: "1:365677646337:web:19d5afebe9c1f44b11e600",
  measurementId: "G-C39E3X1S2K",
});

const db = getFirestore(app);

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

function signOutUser() {
  signOut(auth);
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

const SignIn = () => {
  return <button onClick={googlePopup}>Sign in with Google</button>;
};

const SignOut = () => {
  return (
    <button className="logOutButton" onClick={signOutUser}>
      SIGN OUT
    </button>
  );
};

const Header = () => {
  return (
    <div className="header">
      <img className="userPhoto" src={`${getProfilePicUrl()}`} />
      <p className="userName">{getUserName()}</p>
      <SignOut />
    </div>
  );
};

const SignedInUser = () => {
  const [message, setMessage] = useState("");

  const dummy = useRef();
  function updateMessage(e) {
    setMessage(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        name: getUserName(),
        text: message,
        profilePicUrl: getProfilePicUrl(),
        timestamp: serverTimestamp(),
        uid: auth.currentUser.uid,
      });
    } catch (err) {
      console.log("Error writing new message to Firebase Database", err);
    }
    setMessage("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div className="main">
      <Header />
      <ChatRoom />
      <div className="formContainer">
        <form>
          <input
            className="sendInput"
            onChange={(e) => updateMessage(e)}
            value={message}
            placeholder="Say something nice"
          ></input>
          <button className="sendButton" onClick={handleSubmit}>
            SEND
          </button>
        </form>
      </div>

      <div ref={dummy}></div>
    </div>
  );
};

const ChatRoom = () => {
  const messagesRef = query(
    collection(db, "messages"),
    orderBy("timestamp"),
    limit(30)
  );

  const [messagesText] = useCollectionData(messagesRef);

  const mappedMessages = messagesText?.map((message) => (
    <ChatMessage
      key={message.timestamp}
      message={message.text}
      photoUrl={message.profilePicUrl}
      name={message.name}
    />
  ));

  return <>{mappedMessages}</>;
};

const ChatMessage = (props) => {
  const { message, uid, photoUrl, name } = props;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <div>
        <img className="messagePhoto" src={photoUrl} />
      </div>
      <div>
        <p className="messageUser">{name}</p>
        <p className="messageText">{message}</p>
      </div>
    </div>
  );
};

function App() {
  const [user] = useAuthState(auth);

  return <div className="App">{user ? <SignedInUser /> : <SignIn />}</div>;
}

export default App;
