import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import PopFoodAmount from "./PopFoodAmount";
import StapleFoodScreen from "./StapleFoodScreen";
import CustomFoodScreen from "./CustomFoodScreen";


const AddFood = ({route}) => {
  const[isCustom, setIsCustom] = useState(false);
    return(
        <View>
            <TouchableOpacity onPress={()=>setIsCustom(false)}>
                <Text> Staple </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setIsCustom(true)}>
                <Text>Custom</Text>
            </TouchableOpacity>
            {(isCustom==false)? <StapleFoodScreen/>:<CustomFoodScreen/>}
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
export default AddFood;