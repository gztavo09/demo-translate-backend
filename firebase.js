// import firebase from 'firebase/app'
const firebase = require('firebase-admin');
require('firebase-admin/firestore')
require('firebase-admin/auth')

const firebaseConfig = {
    apiKey: "AIzaSyDq6WdWs4x20ue2-DJWuLgSecIo9xaz5F8",
    authDomain: "open-meet-3130f.firebaseapp.com",
    databaseURL: "https://open-meet-3130f-default-rtdb.firebaseio.com",
    projectId: "open-meet-3130f",
    storageBucket: "open-meet-3130f.appspot.com",
    messagingSenderId: "360978459662",
    appId: "1:360978459662:web:6dfc6ddc5ff74d5ab7205f"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()

module.exports = { db, auth }