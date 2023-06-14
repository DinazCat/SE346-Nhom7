import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailHomeScreen from '../screens/DetailHomeScreen';
import TakeNoteScreen from '../screens/TakeNoteScreen';
import AddScreen from '../screens/AddScreen';
import DetailExerciseScreen from '../screens/DetailExerciseScreen';
import DetailMealScreen from '../screens/DetailMealScreen';
import DetailWaterScreen from '../screens/DetailWaterScreen';
import AddItemScreen from '../screens/AddItemScreen';
import AddFoodScreen from '../screens/AddFoodScreen';
import TabsNavigator from './TabsNavigator';
const Stack = createNativeStackNavigator();
export default function HomeStack() {
    return (
        
            <Stack.Navigator>
                <Stack.Screen name='TabsNavigator' component={TabsNavigator} options={{ header: () => null }}/>
                <Stack.Screen name='DetailHomeScreen' component={DetailHomeScreen} 
                options={()=>({
                    header: () => null
                }
                )}/>
                <Stack.Screen name='TakeNoteScreen' component={TakeNoteScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddScreen' component={AddScreen} options={{ header: () => null }}/>
                <Stack.Screen name='DetailExerciseScreen' component={DetailExerciseScreen} options={{ header: () => null }}/>
                <Stack.Screen name='DetailMealScreen' component={DetailMealScreen} options={{ header: () => null }}/>
                <Stack.Screen name='DetailWaterScreen' component={DetailWaterScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddItemScreen' component={AddItemScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddFoodScreen' component={AddFoodScreen} options={{ header: () => null }}/>
            </Stack.Navigator>
    );
  };