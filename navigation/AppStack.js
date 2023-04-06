import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedsScreen from '../screens/FeedsScreen';
import AddPostScreen from '../screens/AddPostScreen';
const Stack = createNativeStackNavigator();
export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='feedsScreen' 
        component={FeedsScreen} 
        options={{ header: () => null }}
      />
       <Stack.Screen 
        name='addPostScreen' 
        component={AddPostScreen} 
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}