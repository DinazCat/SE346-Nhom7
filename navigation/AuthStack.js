import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPassword from '../screens/ForgotPassword';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const Stack = createNativeStackNavigator();

export default function AuthStack() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '707556182455-fkdc22e8qk83r8q1u6pas9tsntj63e6a.apps.googleusercontent.com',
    });
  }, []);
  return (
    <Stack.Navigator initialRouteName='loginScreen'>
      <Stack.Screen
        name='loginScreen'
        component={LoginScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
            name="signupScreen"
            component={SignupScreen}
            options={({navigation}) => ({
              title: '',
              headerStyle: {
                backgroundColor: '#faf9ad',
                shadowColor: '#f9fafd',
                elevation: 0,
              },
              headerLeft: () => (
                <View style={{color: '#faf9ad'}}>
                  <FontAwesome.Button 
                    name="long-arrow-left"
                    size={25}
                    backgroundColor="#faf9ad"
                    color="#333"
                    onPress={() => navigation.navigate('loginScreen')}
                  />
                </View>
              ), 
            })}
          />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={({navigation}) => ({
          title: 'Reset',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#faf9ad',
            shadowColor: '#f9fafd',
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{color: '#faf9ad'}}>
              <FontAwesome.Button 
                name="long-arrow-left"
                size={25}
                backgroundColor="#faf9ad"
                color="#333"
                onPress={() => navigation.navigate('loginScreen')}
              />
            </View>
          ), 
        })}
      />
    </Stack.Navigator>
  );
}