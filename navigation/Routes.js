import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import { AuthContext } from './AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageContext from '../context/LanguageContext';
import firestore from '@react-native-firebase/firestore';

import MainStack from './MainStack';
import ThemeContext from '../context/ThemeContext';

export default function Routes() {
    const { user, setUser } = useContext(AuthContext);
    //const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);
    const [language, setLanguage] = useState('');
    const [theme, setTheme] = useState('');

    const isDarkTheme = async () => {

      await firestore()
        .collection('theme')
        .doc(auth().currentUser.uid)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
            firestore().collection('theme').doc(user.uid).set({
              theme: 'light'
            }).then().catch((e)=>{console.log("error "+ e)});
            setTheme('light');
          }
          else {
            
              setTheme(documentSnapshot.data().theme);
              //setLoading(false);
          }
        });
    };

    function onAuthStateChanged(user) {
      setUser(user);
      
      if (initializing) setInitializing(false);
      //setLoading(false);
    }
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      //dispatch(isCheck());
      AsyncStorage.getItem('language')
        .then((value) => {
          if (value) {
            setLanguage(value);
          } else {
            setLanguage('en');
          }
        })
        .catch((error) => {
          console.log(error);
        });
        isDarkTheme(); 
      return subscriber;
    }, []);

    if (initializing) return null;

    return (
      <NavigationContainer>
        <ThemeContext.Provider value={theme}>
        <LanguageContext.Provider value={language}>
          {user ? <MainStack/> : <AuthStack />}
        </LanguageContext.Provider>      
        </ThemeContext.Provider>
      </NavigationContainer>
    );
  }