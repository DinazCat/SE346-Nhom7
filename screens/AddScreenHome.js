import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabContainer from "../components/TabContainer";
import { NavigationContainer } from '@react-navigation/native';
import AddScreen from "./AddScreen";
import AddWater from "./AddWater";
import AddSearchFood from "./AddSearchFood";
const Stack = createNativeStackNavigator();

  const AddScreenHome = () => {
    return (
      <TabContainer>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='AddScreen' component={AddScreen} />
                <Stack.Screen name='AddWater' component={AddWater} />
                <Stack.Screen name="AddSearchFood" component={AddSearchFood} />
            </Stack.Navigator>
        </NavigationContainer>
      </TabContainer>
    );
  };
  
export default AddScreenHome;