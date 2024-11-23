importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

var firebaseConfig ={
  apiKey: "AIzaSyC8fGnPNZGtnQ7NAoOkvTHBzbQlSNNHo_g",
  authDomain: "rk-ludo-1c009.firebaseapp.com",
  projectId: "rk-ludo-1c009",
  storageBucket: "rk-ludo-1c009.appspot.com",
  messagingSenderId: "174842426344",
  appId: "1:174842426344:web:3e5eba621ab4e49bbbaa5d",
  measurementId: "G-SF0BZMGDLL"
}


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  backgound_notification(payload)

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});