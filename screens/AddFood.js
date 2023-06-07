import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import PopFoodAmount from "./PopFoodAmount";
import StapleFoodScreen from "./StapleFoodScreen";
import CustomFoodScreen from "./CustomFoodScreen";
import LanguageContext from "../context/LanguageContext";
//để isAdd trong redux = false khi nhấn vào staple

const AddFood = ({route}) => {
  const[isCustom, setIsCustom] = useState(false);
  const language = useContext(LanguageContext);

    return(
        <View>
            <TouchableOpacity onPress={()=>setIsCustom(false)}>
                <Text>{language === 'vn' ? 'Có sẵn' : 'Staple'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setIsCustom(true)}>
                <Text>{language === 'vn' ? 'Tùy chỉnh' : 'Custom'}</Text>
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