import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddScreen from '../screens/AddScreen';
import AddWater from '../screens/AddWater';
import AddPostScreen from '../screens/AddPostScreen';
import AddExerciseScreen from '../screens/AddExerciseScreen';
import IngredientScreen from '../screens/IngredientScreen';
import AddCustomRecipe from '../screens/AddCustomRecipe';
import DetailFoodScreen from '../screens/DetailFoodScreen';

const Stack = createNativeStackNavigator();
export default function AddStack() {
    return (
            <Stack.Navigator >
                <Stack.Screen name='AddScreen' component={AddScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddWater' component={AddWater} options={{ header: () => null }}/>
                <Stack.Screen name='AddCustomRecipe' component={AddCustomRecipe} options={{ header: () => null }}/>
                <Stack.Screen name='AddPostScreen' component={AddPostScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddExercise' component={AddExerciseScreen} options={{ header: () => null }}/>
                <Stack.Screen name='IngredientScreen' component={IngredientScreen} options={{ header: () => null }}/>
                <Stack.Screen name='DetailFood' component={DetailFoodScreen} options={{ header: () => null }}/>
                
            </Stack.Navigator>
    );
  };