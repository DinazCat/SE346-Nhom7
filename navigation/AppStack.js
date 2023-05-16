import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedsScreen from '../screens/FeedsScreen';
import AddPostScreen from '../screens/AddPostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentScreen from '../screens/CommentScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import DetailPostScreen from '../screens/DetailPost';
import SearchScreen from '../screens/SearchScreen';
import EditComment from '../screens/EditComment';
import EditPostScreen from'../screens/EditPostScreen';
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
        name='searchScreen' 
        component={SearchScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='addPostScreen' 
        component={AddPostScreen} 
        options={{ header: () => null }}
      />
       <Stack.Screen 
        name='editPostScreen' 
        component={EditPostScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='profileScreen' 
        component={ProfileScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='commentScreen' 
        component={CommentScreen} 
        options={{ header: () => null }}
      />
       <Stack.Screen 
        name='detailScreen' 
        component={DetailPostScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="editProfileScreen"
        component={EditProfileScreen}
        options={{
          headerTitle: 'Edit Profile',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fff',
            shadowColor: '#fff',
            elevation: 0,
          },
        }}
      />
      <Stack.Screen 
        name='editComment' 
        component={EditComment} 
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}