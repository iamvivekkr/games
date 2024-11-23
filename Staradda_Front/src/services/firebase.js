import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
const axios = require("axios");
const EndPoint = process.env.REACT_APP_API_URL;
const firebaseConfig = {
  apiKey: "AIzaSyC8fGnPNZGtnQ7NAoOkvTHBzbQlSNNHo_g",
  authDomain: "rk-ludo-1c009.firebaseapp.com",
  projectId: "rk-ludo-1c009",
  storageBucket: "rk-ludo-1c009.appspot.com",
  messagingSenderId: "174842426344",
  appId: "1:174842426344:web:3e5eba621ab4e49bbbaa5d",
  measurementId: "G-SF0BZMGDLL",
};
const access_token = localStorage.getItem("token");
const fcm = localStorage.getItem("fcm");
export const getTokens = (setTokenFound) => {
  return getToken(messaging, {
    vapidKey:
      "BLbWMX7SRh7pjoIq9BcWaxugwmNFpMHswNdU0kHtWlt3lhb_RJKfFiWlCofwO7G0pMXSiGoASPgcYFLCdzH-BTE",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);

        if (access_token && fcm != currentToken) {
          const headers = {
            Authorization: `Bearer ${access_token}`,
          };
          axios
            .get(`${EndPoint}/updateToken?firebaseToken=${currentToken}`, {
              headers,
            })
            .then((res) => {
              console.log(res);
              localStorage.setItem("fcm", currentToken);
            })
            .catch((e) => {
              console.log(e);
            });
        }
        setTokenFound({ status: true, token: currentToken });
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
      console.log(payload);
    });
  });

// async function loginWithGoogle() {
//     try {
//         const provider = new GoogleAuthProvider();
//         const auth = getAuth();

//         const { user } = await signInWithPopup(auth, provider);

//         return { uid: user.uid, displayName: user.displayName };
//     } catch (error) {
//         if (error.code !== 'auth/cancelled-popup-request') {
//             console.error(error);
//         }

//         return null;
//     }
// }
// const provider=JSON.parse(localStorage.getItem('provider'));
//console.log(provider?.provider_data?.id)
// async function sendMessage(roomId, user, text) {
//     try {
//         await addDoc(collection(db, 'chatRoom', roomId, 'chats'), {
//             //   uid: user.uid,
//             //   displayName: user.displayName,
//             //   text: text.trim(),
//             //   timestamp: serverTimestamp(),
//             uid: user?.data?.id || null,
//             displayName: user?.data?.display_name || null,
//             user_type:user?.data?.user_type,
//             reciver_id:provider?.provider_data?.id,
//             text: text.trim(),
//             timestamp: serverTimestamp(),
//         });

//     } catch (error) {
//         console.error(error);
//     }
// }

// function getMessages(roomId, callback) {
//     return onSnapshot(
//         query(
//             collection(db, 'chatRoom', roomId, 'chats'),
//             orderBy('timestamp', 'asc')
//         ),
//         (querySnapshot) => {
//             const messages = querySnapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             console.log(messages)
//             callback(messages);
//         }
//     );
// }

// export { loginWithGoogle, sendMessage, getMessages };
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
const db = getFirestore(app);
