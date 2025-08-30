import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/messaging';
import { useSelector } from 'react-redux';
import { selectData } from '../store/reducers/settings';
require("firebase/auth");
require("firebase/firestore");


const FirebaseData = () => {
// api calls

  const data = useSelector(selectData)

  let firebaseConfig = {
      apiKey: data.firebase_settings[0].apiKey,
      authDomain: data.firebase_settings[0].authDomain,
      projectId: data.firebase_settings[0].projectId,
      storageBucket: data.firebase_settings[0].storageBucket,
      messagingSenderId: data.firebase_settings[0].messagingSenderId,
      appId: data.firebase_settings[0].appId,
      measurementId: data.firebase_settings[0].measurementId,
    };



// eslint-disable-next-line
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();

const messaging = firebase.messaging(); // Add this line


const facebookprovider = new firebase.auth.FacebookAuthProvider();

return { auth, googleProvider, facebookprovider, firebase, messaging };

}

export default FirebaseData;
