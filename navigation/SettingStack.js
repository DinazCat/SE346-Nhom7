import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingNoti from '../screens/SettingNoti';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();
export default function SettingStack() {
    return (
            <Stack.Navigator >
                <Stack.Screen name='Setting' component={SettingsScreen} options={{ header: () => null }}/>
                <Stack.Screen name='settingNoti' component={SettingNoti} options={{ header: () => null }}/>
                <Stack.Screen name='editProfileScreen' component={EditProfileScreen} options={{ header: () => null }}/>
            </Stack.Navigator>
    );
  };