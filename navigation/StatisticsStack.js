import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWeight from '../screens/AddWeight';
import LineChartWeightScreen from '../screens/LineChartWeightScreen';
const Stack = createNativeStackNavigator();
export default function StatisticsStack() {
    return (
            <Stack.Navigator>
                <Stack.Screen name='LineChartWeightScreen' component={LineChartWeightScreen} />
                <Stack.Screen name='AddWeight' component={AddWeight} />

            </Stack.Navigator>
    );
  };