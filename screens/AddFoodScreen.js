import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import React, {useState} from "react";
import StapleFoodScreen from "./StapleFoodScreen";
import CustomRecipeScreen from "./CustomRecipeScreen";
import CustomFoodScreen from "./CustomFoodScreen";
import moment from "moment";
//để isAdd trong redux = false khi nhấn vào staple

const AddFoodScreen = ({route}) => {
  const [page, setPage] = useState(0);
  const date = route.params?.date || moment(new Date()).format('DD/MM/YYYY');
  const isNavigation = (route.params)? true:false;
  const mealType = route.params?.mealType;
    return(
        <View>
            <TouchableOpacity onPress={()=> setPage(0)}>
                <Text> Staple </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=>setPage(1)}>
                <Text>Custom Food</Text>
            </TouchableOpacity>
            {(() => {
        switch (page) {
          case 0:
            return <StapleFoodScreen date={date} isNavigation={isNavigation} mealType={mealType}/>;
          case 1:
            return <CustomFoodScreen date={date} isNavigation={isNavigation} mealType={mealType}/>;
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
export default AddFoodScreen;