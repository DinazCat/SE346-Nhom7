import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddScreen from '../screens/AddScreen';
import AddWater from '../screens/AddWater';
import AddSearchFood from '../screens/AddSearchFood';
import AddWeight from '../screens/AddWeight';
import LineChartWeightScreen from '../screens/LineChartWeightScreen';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
export default function AddStack() {
    return (
            <Stack.Navigator>
                <Stack.Screen name='AddScreen' component={AddScreen} />
                <Stack.Screen name='AddWater' component={AddWater} />
                <Stack.Screen name="AddSearchFood" component={AddSearchFood} />
                <Stack.Screen name="LineChartWeightScreen" component={LineChartWeightScreen}/>
                <Stack.Screen name="AddWeight" component={AddWeight}/>
            </Stack.Navigator>
    );
  };