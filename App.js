import React from 'react';
import Providers from './navigation';
import { createContext, useState,useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import Notifee from '@notifee/react-native';
import { store } from './store/store';
import { Provider } from "react-redux";
export default () => {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
};

const App = () => {
  const requestUserPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permission granted.');
    }
  };
  const showNotification = async (remoteMessage) => {
    const channelId = await Notifee.createChannel({
      id:'default',
      name:'Default Channel',
    });
     await Notifee.displayNotification({
      title: remoteMessage.notification.title,
      body:  remoteMessage.notification.body,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        largeIcon: require('./assets/food.png'),
      },
    });}
  useEffect(() => { 
    requestUserPermission();
         messaging().onNotificationOpenedApp(async (remoteMessage) => {
           console.log(
             'Notification caused app to open from background state:',
             remoteMessage.notification,
           );
         });
         messaging()
         .getInitialNotification()
         .then(async (remoteMessage) => {
           if (remoteMessage) {
             console.log(
               'Notification caused app to open from quit state:',
               remoteMessage.notification,
             );
           }
           else console.log('a')
         });
         messaging().onMessage(async (remoteMessage) => {
           const { title, body } = remoteMessage.notification;
           console.log('Message on!', remoteMessage.notification);
          showNotification(remoteMessage)
         });
         messaging().setBackgroundMessageHandler(async (remoteMessage) => {
           console.log('Message handled in the background!', remoteMessage);
         });
           
       
       }, []);
  return <Providers />;
}