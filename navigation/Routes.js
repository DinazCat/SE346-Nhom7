import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from './AuthProvider';
import TabsNavigator from './TabsNavigator';

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
        {user ? <TabsNavigator /> : <AuthStack />}
      </NavigationContainer>
    );
  }