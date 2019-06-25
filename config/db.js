var firebase = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    apiKey: "AIzaSyCUYCvJRQTqV_JcsDl3sCNbDK8D7h6Fipo",
    authDomain: "recipe-e53af.firebaseapp.com",
    databaseURL: "https://recipe-e53af.firebaseio.com",
    projectId: "recipe-e53af",
    storageBucket: "recipe-e53af.appspot.com",
    messagingSenderId: "394640815435",
    appId: "1:394640815435:web:c0ac2a3aa3fb2087"

});

module.exports = firebase;