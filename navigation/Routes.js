import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import { AuthContext } from './AuthProvider';
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { isCheck } from '../store/isQuestionNullSlice';

import MainStack from './MainStack';
import QuestionStack from './QuestionStack';

export default function Routes() {
    const { user, setUser } = useContext(AuthContext);
    const dispatch = useDispatch();
    //const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);
   

    function onAuthStateChanged(user) {
      setUser(user);
      
      if (initializing) setInitializing(false);
      //setLoading(false);
    }
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      //dispatch(isCheck());
      return subscriber;
    }, []);

    if (initializing) return null;

    return (
      <NavigationContainer>
        {user ? <MainStack/> : <AuthStack />}
      </NavigationContainer>
    );
  }