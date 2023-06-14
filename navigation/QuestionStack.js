import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetSexScreen from '../screens/GetSexScreen';
import GetAgeHeightWeightScreen from '../screens/GetAgeHeightWeightScreen';
import GetGoalScreen from '../screens/GetGoalScreen';
import GetWeeklyGoalScreen from '../screens/GetWeeklyGoalScreen';
import GetActivityLevelScreen from '../screens/GetActivityLevelScreen';
import TabsNavigator from './TabsNavigator';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Stack = createNativeStackNavigator();

const QuestionStack = () => {
  const dispatch = useDispatch();
  //dispatch(isCheck());
  const initialScreen = useSelector((state) => state. isQuestionNull.value);
  return (
    <Stack.Navigator initialRouteName={initialScreen}>
      
      <Stack.Screen 
        name='GetAgeHeightWeightScreen' 
        component={GetAgeHeightWeightScreen} 
        options={{ header: () => null }}
      />
      <Stack.Screen 
        name='TabsNavigator' 
        component={TabsNavigator} 
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
