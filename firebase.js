import * as firebase from 'firebase';
import 'firebase/firebase-firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyCuzxKme9_iFaWaJgE_qCpdEaOEhhvc4ik',
  authDomain: 'pockets-9191a.firebaseapp.com',
  databaseURL: 'https://pockets-9191a.firebaseio.com',
  projectId: 'pockets-9191a',
  storageBucket: 'pockets-9191a.appspot.com',
  messagingSenderId: '120173377569',
  appId: '1:120173377569:web:9c330e4706707adbaecb60',
  measurementId: 'G-CDMZW0H6T1',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
var firestore = firebase.firestore();

export default firestore;
