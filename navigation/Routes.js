import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import { AuthContext } from './AuthProvider';
import { store } from '../store/store';
import { Provider } from "react-redux";
import TabContainer from '../components/TabContainer';

import MainStack from './MainStack';

export default function Routes() {
    const { user, setUser } = useContext(AuthContext);
    //const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);

    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false);
      //setLoading(false);
    }
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber;
    }, []);

    if (initializing) return null;

    return (
      <NavigationContainer>
        {user ? <MainStack/> : <AuthStack />}
      </NavigationContainer>
    );
  }