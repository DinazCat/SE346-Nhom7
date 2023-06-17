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
        AsyncStorage.getItem('theme')
        .then((value) => {
          if (value) {
            setTheme(value);
          } else {
            setTheme('light');
          }
        })
        .catch((error) => {
          console.log(error);
        });
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