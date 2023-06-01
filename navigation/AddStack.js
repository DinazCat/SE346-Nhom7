import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddScreen from '../screens/AddScreen';
import AddWater from '../screens/AddWater';
import AddFood from '../screens/AddFood';
import AddCustomFood from '../screens/AddCustomFood';
import AddPostScreen from '../screens/AddPostScreen';
import AddExerciseScreen from '../screens/AddExerciseScreen';
import StapleFoodScreen from '../screens/StapleFoodScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

const Stack = createNativeStackNavigator();
export default function AddStack() {
    return (
            <Stack.Navigator >
                <Stack.Screen name='AddScreen' component={AddScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddWater' component={AddWater} options={{ header: () => null }}/>
                <Stack.Screen name='AddFood' component={AddFood} options={{ header: () => null }}/>
                <Stack.Screen name='AddCustomFood' component={AddCustomFood} options={{ header: () => null }}/>
                <Stack.Screen name='AddPostScreen' component={AddPostScreen} options={{ header: () => null }}/>
                <Stack.Screen name='StapleFood' component={StapleFoodScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddExercise' component={AddExerciseScreen} options={{ header: () => null }}/>
            </Stack.Navigator>
    );
  };