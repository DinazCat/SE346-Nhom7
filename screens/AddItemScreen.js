import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import React, {useState} from "react";
import StapleFoodScreen from "./StapleFoodScreen";
import CustomRecipeScreen from "./CustomRecipeScreen";
import CustomFoodScreen from "./CustomFoodScreen";
import moment from "moment";
import AddWater from "./AddWater";
import AddExerciseScreen from "./AddExerciseScreen";
//để isAdd trong redux = false khi nhấn vào staple

const AddItemScreen = ({route}) => {
  const page = route.params?.page;
  const date = route.params?.date || moment(new Date()).format('DD/MM/YYYY');
  const isNavigation = (route.params)? true:false;
    return(
       <View>
            {(() => {
        switch (page) {
          case 0:
            return <StapleFoodScreen date={date} isNavigation={isNavigation}/>;
          case 1:
            return <CustomRecipeScreen/>;
          case 2:
            return <CustomFoodScreen date={date} isNavigation={isNavigation}/>;
          case 3:
            return <AddWater date={date} isNavigation={isNavigation}/>;
          case 4:
            return <AddExerciseScreen date={date} isNavigation={isNavigation}/>;
          default:
            return null;
        }
      })()}
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      borderWidth: 1, 
      borderColor: "#CFCFCF", 
      borderRadius: 5, 
      backgroundColor: "#CFCFCF", 
      margin: 5,
    },
    text: {
      fontSize: 18,
      color: '#84D07D',
    },
  
    tabIcon: {
      width: 25,
      height: 25,
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      width: '100%',
      height: 40,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
  });
export default AddItemScreen;