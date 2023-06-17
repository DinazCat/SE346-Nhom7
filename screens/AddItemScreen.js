import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import React, {useState, useContext} from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import StapleFoodScreen from "./StapleFoodScreen";
import CustomRecipeScreen from "./CustomRecipeScreen";
import CustomFoodScreen from "./CustomFoodScreen";
import moment from "moment";
import AddWater from "./AddWater";
import AddExerciseScreen from "./AddExerciseScreen";
import ThemeContext from "../context/ThemeContext";

const AddItemScreen = ({route, navigation}) => {
  const page = route.params?.page;
  const theme = useContext(ThemeContext)
  const date = route.params?.date || moment(new Date()).format('DD/MM/YYYY');
  const isNavigation = (route.params)? true:false;
  const back = () => {
    navigation.goBack();
  }
    return(
      <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
       <View style={{flex: 0.9}}> 
        <TouchableOpacity style={{marginLeft: 15, marginTop: 5}} onPress={back}>
        <Icon name={'arrow-left'} size={25} color={theme==='light'?"#000":"#fff"}/>
      </TouchableOpacity>
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