import React, { useContext } from 'react';
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
import NotificationScreen from '../screens/NotificationScreen';
import GotoPostScreen from '../screens/GotoPostScreen';
import savedPostScreen from '../screens/savedPostScreen';
import ThemeContext from '../context/ThemeContext';
const Stack = createNativeStackNavigator();

export default function AppStack() {
  const theme = useContext(ThemeContext);
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
        options={{ 
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme==='light'?'#fff':'#000',
            
            elevation: 0,
          },
          headerTintColor: theme==='light'?'#000':'#fff',
          
         }}
      />
       <Stack.Screen 
        name='savedScreen' 
        component={savedPostScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='commentScreen' 
        component={CommentScreen} 
        options={{ header: () => null }}
      />
       <Stack.Screen 
        name='nofiScreen' 
        component={NotificationScreen} 
        options={{ header: () => null }}
      />
       <Stack.Screen 
        name='gotoPost' 
        component={GotoPostScreen} 
        options={{ header: () => null }}
      />
       <Stack.Screen 
        name='detailScreen' 
        component={DetailPostScreen} 
        options={{ 
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme==='light'?'#fff':'#000',
            
            elevation: 0,
          },
          headerTintColor: theme==='light'?'#000':'#fff',
          
         
         }}
      />
      <Stack.Screen
        name="editProfileScreen"
        component={EditProfileScreen}
        options={{
          header: () => null
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