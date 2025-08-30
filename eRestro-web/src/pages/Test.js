import React, {useEffect} from 'react'
import firebaseconfig from "../utils/firebase";
// const admin = require('firebase-admin');

const Test = () => {
  const { messaging } = firebaseconfig();

  useEffect(() => {
    const setupMessaging = async () => {
      try {
        // Request permission to receive notifications
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          // Get the FCM token
          const token = await messaging.getToken();
          console.log("FCM Token:", token);

          // Now you can send this token to your server to associate it with the user
        } else {
          console.log("Notification permission denied");
        }
      } catch (error) {
        console.error("Error setting up messaging:", error);
      }
    };

    setupMessaging();
  }, [messaging]);

  console.log(messaging);
  return (
    <div>Test</div>
  )
}

export default Test