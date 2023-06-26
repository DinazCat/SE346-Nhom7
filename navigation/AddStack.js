import React, {useContext} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddScreen from '../screens/AddScreen';
import AddPostScreen from '../screens/AddPostScreen';
import IngredientScreen from '../screens/IngredientScreen';
import AddCustomRecipe from '../screens/AddCustomRecipe';
import DetailFoodScreen from '../screens/DetailFoodScreen';
import {StyleSheet} from "react-native";
import {getFocusedRouteNameFromRoute} from '@react-navigation/native'
import ThemeContext from '../context/ThemeContext';
import EditFoodScreen from '../screens/EditFoodScreen';
import EditExerciseScreen from '../screens/EditExerciseScreen';
const Stack = createNativeStackNavigator();
export default function AddStack({navigation, route}) {
    const theme = useContext(ThemeContext);
    React.useLayoutEffect(() => {
        if (getFocusedRouteNameFromRoute(route) === 'DetailFood' || 
            getFocusedRouteNameFromRoute(route) === 'AddPostScreen' || 
            getFocusedRouteNameFromRoute(route) === 'AddCustomRecipe' ||
            getFocusedRouteNameFromRoute(route) === 'IngredientScreen' ||
            getFocusedRouteNameFromRoute(route) ==='EditFood' ||
            getFocusedRouteNameFromRoute(route) ==='EditExercise' ||
            getFocusedRouteNameFromRoute(route) === 'DetailFood') {
            navigation.setOptions({tabBarStyle: {display: 'none'}});
        }else {
            navigation.setOptions({tabBarStyle: [styles.tabBar, {backgroundColor: theme==='light'?"#fff":"#2B2B2B", borderColor: theme==='light'?"#2B2B2B":"#fff"}]});
        }
      }, [getFocusedRouteNameFromRoute(route)]);
    return (
            <Stack.Navigator>
                <Stack.Screen name='AddScreen' component={AddScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddCustomRecipe' component={AddCustomRecipe} options={{ header: () => null }}/>
                <Stack.Screen name='AddPostScreen' component={AddPostScreen} options={{ header: () => null }}/>
                <Stack.Screen name='IngredientScreen' component={IngredientScreen} options={{ header: () => null }}/>
                <Stack.Screen name='DetailFood' component={DetailFoodScreen} options={{ header: () => null }}/>
                <Stack.Screen name='EditFood' component={EditFoodScreen} options={{ header: () => null }}/>
                <Stack.Screen name='EditExercise' component={EditExerciseScreen} options={{ header: () => null }}/>
            </Stack.Navigator>
    );
  };
  const styles = StyleSheet.create({
    tabBar: {
      position: "absolute",
      height: 56,
      bottom: 0,
      
      
      //borderTopColor: "transparent",
      shadowColor: "#000",
      shadowOffset: {
        height: 6,
        width: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
  
    
  });