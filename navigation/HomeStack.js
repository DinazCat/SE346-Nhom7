import React, {useContext} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StyleSheet} from "react-native";
import HomeScreen from '../screens/HomeScreen';
import DetailHomeScreen from '../screens/DetailHomeScreen';
import TakeNoteScreen from '../screens/TakeNoteScreen';
import AddScreen from '../screens/AddScreen';
import DetailExerciseScreen from '../screens/DetailExerciseScreen';
import DetailMealScreen from '../screens/DetailMealScreen';
import DetailWaterScreen from '../screens/DetailWaterScreen';
import AddItemScreen from '../screens/AddItemScreen';
import AddFoodScreen from '../screens/AddFoodScreen';
import DetailFoodScreen from '../screens/DetailFoodScreen';
import AddCustomRecipe from '../screens/AddCustomRecipe';
import IngredientScreen from '../screens/IngredientScreen';
import AddPostScreen from '../screens/AddPostScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native'
import ThemeContext from '../context/ThemeContext';
import EditWaterScreen from '../screens/EditWaterScreen';
import EditExerciseScreen from '../screens/EditExerciseScreen';
import EditFoodScreen from '../screens/EditFoodScreen';
const Stack = createNativeStackNavigator();
export default function HomeStack({navigation, route}) {
    const theme = useContext(ThemeContext);
    React.useLayoutEffect(() => {
        if (getFocusedRouteNameFromRoute(route) === 'DetailFood' || 
            getFocusedRouteNameFromRoute(route) === 'DetailHomeScreen' || 
            getFocusedRouteNameFromRoute(route) === 'AddScreen' ||
            getFocusedRouteNameFromRoute(route) === 'DetailExerciseScreen' ||
            getFocusedRouteNameFromRoute(route) === 'AddPostScreen' ||
            getFocusedRouteNameFromRoute(route) === 'DetailMealScreen' ||
            getFocusedRouteNameFromRoute(route) === 'DetailWaterScreen' ||
            getFocusedRouteNameFromRoute(route) === 'IngredientScreen' ||
            getFocusedRouteNameFromRoute(route) === 'AddItemScreen' ||
            getFocusedRouteNameFromRoute(route) === 'AddCustomRecipe' ||
            getFocusedRouteNameFromRoute(route) === 'TakeNoteScreen' ||
            getFocusedRouteNameFromRoute(route) === 'EditWater' ||
            getFocusedRouteNameFromRoute(route) === 'EditExercise' ||
            getFocusedRouteNameFromRoute(route) === 'EditFood' ||
            getFocusedRouteNameFromRoute(route) === 'AddFoodScreen') {
            navigation.setOptions({tabBarStyle: {display: 'none'}});
        }else {
            navigation.setOptions({tabBarStyle: [styles.tabBar, {backgroundColor: theme==='light'?"#fff":"#2B2B2B", borderColor: theme==='light'?"#2B2B2B":"#fff"}]});
        }
      }, [getFocusedRouteNameFromRoute(route)]);
    return (
        
            <Stack.Navigator>
                <Stack.Screen name='HomeScreen' component={HomeScreen} options={()=>({ header: () => null })}/>
                <Stack.Screen name='DetailFood' component={DetailFoodScreen} options={()=>({ header: () => null })}/>
                <Stack.Screen name='DetailHomeScreen' component={DetailHomeScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddScreen' component={AddScreen} options={{ header: () => null }}/>
                <Stack.Screen name='DetailExerciseScreen' component={DetailExerciseScreen} options={{ header: () => null }}/>
                <Stack.Screen name='DetailMealScreen' component={DetailMealScreen} options={{ header: () => null }}/>
                <Stack.Screen name='DetailWaterScreen' component={DetailWaterScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddItemScreen' component={AddItemScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddFoodScreen' component={AddFoodScreen} options={{ header: () => null }}/>
                <Stack.Screen name='AddCustomRecipe' component={AddCustomRecipe} options={{ header: () => null }}/>
                <Stack.Screen name='AddPostScreen' component={AddPostScreen} options={{ header: () => null }}/>
                <Stack.Screen name='IngredientScreen' component={IngredientScreen} options={{ header: () => null }}/>
                <Stack.Screen name='TakeNoteScreen' component={TakeNoteScreen} options={{ header: () => null }}/>
                <Stack.Screen name='EditWater' component={EditWaterScreen} options={{ header: () => null }}/>
                <Stack.Screen name='EditExercise' component={EditExerciseScreen} options={{ header: () => null }}/>
                <Stack.Screen name='EditFood' component={EditFoodScreen} options={{ header: () => null }}/>
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