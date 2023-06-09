import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetSexScreen from '../screens/GetSexScreen';
import GetAgeHeightWeightScreen from '../screens/GetAgeHeightWeightScreen';
import GetGoalScreen from '../screens/GetGoalScreen';
import GetWeeklyGoalScreen from '../screens/GetWeeklyGoalScreen';
import GetActivityLevelScreen from '../screens/GetActivityLevelScreen';
import TabsNavigator from './TabsNavigator';

const Stack = createNativeStackNavigator();

const QuestionStack = () => {
  return (
    <Stack.Navigator initialRouteName='GetAgeHeightWeightScreen'>
      <Stack.Screen 
        name='TabsNavigator' 
        component={TabsNavigator} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='GetAgeHeightWeightScreen' 
        component={GetAgeHeightWeightScreen} 
        options={{ header: () => null }}
      />
       <Stack.Screen 
        name='GetSexScreen' 
        component={GetSexScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='GetGoalScreen' 
        component={GetGoalScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='GetWeeklyGoalScreen' 
        component={GetWeeklyGoalScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='GetActivityLevelScreen' 
        component={GetActivityLevelScreen} 
        options={{ header: () => null }}
      />
      
      
    </Stack.Navigator>
    )
};

export default QuestionStack;
