

import React, { createContext, useState,useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
const SendNoti=async(mess, userId)=>{
  let token="";
    await firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        token = documentSnapshot.data().token;
      }
    })
const serverKey = 'AAAApL2iibc:APA91bEx-gr4SlQ1eGuJ-8qYW-yhUY6OgXmlPGZevA14s8qytlB4uPNxBWXGcc8xwFVJCGQ-4KdCDJDPoHb-Mc9mMLz4WKYEyfnHMxbT03XpgCSuAjI4YoYt2bC7lzTmMgj4bAiDKdzi';
//const deviceToken = 'e_K_cFBpR_6ShAmjcJ0kIy:APA91bHVHZwSRZsltqI7uFHY02wt9FNB_Up-5p-LPXpiT9PiAgyPPPCXvypjlweavjodEUyb5QwfGXL3KdgSGwTqmmie1zXa1LEZoA820jiZ2vZ6pcSwG2mTsoDHlwBb340Q-xKHhK6f';
//console.log(deviceToken);
  const notification = {
    to: token,
    notification: {
      title: 'Thông báo',
      body: mess,
    },
  };

  try {
    const response = await axios.post('https://fcm.googleapis.com/fcm/send', notification, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${serverKey}`,
      },
    });

    console.log('Notification sent:', response.data);
  
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
    

export default SendNoti;