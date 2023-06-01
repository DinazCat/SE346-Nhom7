import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { isAdd } from "../store/CustomFoodSlice";
import firestore from '@react-native-firebase/firestore';
const CustomFoodScreen = () => {
  
  const dispatch = useDispatch();
  const [datas, setDatas] = useState();
  const addIngredient = () => {
    dispatch(isAdd(true));
    navigation.navigate("AddCustomFood", {});
  }
  const shareCustomFood = (item) => {
    navigation.navigate('AddPostScreen', {name: item.name, image: item.image, calories: item.calories.toString()})
  }
  useEffect(() => {
    fetchCustomFoods();
   }, []);
  const fetchCustomFoods = async()=>{
    try{
      firestore()
      .collection('customFoods')
      .onSnapshot((querySnapshot)=>{
        const list = [];
        querySnapshot.forEach(doc =>{
          const {image, name, calories, cookingTime, ingredient, prepTime, receipt} = doc.data();
          list.push({          
            id: doc.id,
            name: name,
            image: image,
            calories: calories,
            
          });
        })
        setDatas(list);

      })
     
    } catch(e){
      console.log(e);
    }
  }
  
  const navigation = useNavigation();
  //flat list don't have data
  
    return (
      <View styles={{flex:1}}>
      <View style={{flexDirection:'row'}}>
        <Icon name={'search'} />
        <TextInput
        placeholder="Search food"
        placeholderTextColor={'rgba(0,0,0,0.8)'}
        />
        <TouchableOpacity onPress={()=>addIngredient()}>
          <Text>Add</Text>
        </TouchableOpacity>
        </View>
        
          <FlatList 
              data={datas}
              renderItem={({item}) => (
                <TouchableOpacity onPress={()=>shareCustomFood(item)}>
                  <View >
                      <Image source={{uri: item.image}} style={styles.tabIcon}/>
                      <Text > {item.name} </Text>
                      <Text > {item.calories}cals/servings  </Text>
                     
                  </View>

                </TouchableOpacity>
              )}
          
              keyExtractor={(item, index) => index.toString()}
          />
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
  });
export default CustomFoodScreen;