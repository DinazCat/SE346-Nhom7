import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import { AuthContext } from './AuthProvider';
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { isCheck } from '../store/isQuestionNullSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageContext from '../context/LanguageContext';

import MainStack from './MainStack';

export default function Routes() {
    const { user, setUser } = useContext(AuthContext);
    const dispatch = useDispatch();
    //const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);
    const [language, setLanguage] = useState('');

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
      return subscriber;
    }, []);

    if (initializing) return null;

    return (
      <NavigationContainer>
        <LanguageContext.Provider value={language}>
          {user ? <MainStack/> : <AuthStack />}
        </LanguageContext.Provider>      
      </NavigationContainer>
    );
  }