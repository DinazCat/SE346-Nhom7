import React, {useState, useEffect, useContext} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { isEdit, isAdd, createNew } from "../store/CustomFoodSlice";
import PopFoodAmount from "./PopFoodAmount";
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from "../navigation/AuthProvider";



const CustomFoodScreen = () => {
  const {user} = useContext(AuthContext);
  const [textSearch, onChangeTextSearch] = useState('');
  const [visible, setVisible] = React.useState(false);//pop to add amount
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('D');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const [datas, setDatas] = useState([{name: 'A'}]);
  const addIngredient = () => {
    
    dispatch(createNew())
    navigation.navigate("AddCustomFood");
  }
  const choosePopup = (item) => {
    setVisible(true);//tí bỏ vô edit, new, choose
    setImage(item.image);
    
    setName(item.name);
    setCalories(item.calories)
  }
  const Add = () => {
    setVisible(true);
    
  }
  const Delete = (item) => {
    firestore().collection('customFoods').doc(item.id).delete().then(() => { });
  }
  const is_edit = (item) =>{
    
    
    dispatch(isEdit(true, item.ingredients, item.calories));
    navigation.navigate('AddCustomFood');
   
    
  }
  const finishAdd = () => {
    setVisible(false)
    if (textSearch == ''){
      
    }
    else{
      firestore().collection('foodsDiary').add({
        userId: user.uid,
        name: name,
        mealType: 'Lunch',
        amount: textSearch,
        calories: (parseInt(textSearch) * parseInt(calories)).toFixed(),
        image: image,
        isCustom: true,
      })
    }
    
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
          const {image, name, calories, cookingTime, ingredients, prepTime, receipt} = doc.data();
          list.push({          
            id: doc.id,
            name: name,
            image: image,
            calories: calories,
            cookingTime: cookingTime,
            prepTime: prepTime,
            receipt: receipt,
            ingredients: ingredients,
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
                <View>
                <TouchableOpacity onPress={()=>choosePopup(item)}>
                  
                      <Image source={{uri: item.image}} style={styles.tabIcon}/>
                      <Text > {item.name} </Text>
                      <Text > {item.calories}cals/serving  </Text>
                      

                </TouchableOpacity>
              </View>
              )}
          
              keyExtractor={(item, index) => index.toString()}
              extraData={datas}
          />

          <PopFoodAmount visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={require('../assets/food.png')}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Image
            source={{uri: image}}
            style={{height: 100, width: 100, marginVertical: 10}}
          />
        </View>
        <View >
        <TextInput style={{marginVertical: 30, fontSize: 20}} value={textSearch} onChangeText={textSearch  =>onChangeTextSearch(textSearch)}/>
        <Text>{calories}cals/serving</Text>
        </View>
        <TouchableOpacity style={{marginVertical: 30, fontSize: 20, textAlign: 'center'}} onPress={()=>finishAdd()}>
          <Text>Add</Text>
        </TouchableOpacity>
      </PopFoodAmount>

    
          
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
    popover:{
      backgroundColor: 'white', 
      borderRadius: 10, 
      padding: 16, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
    },
    popoverItem:{
      alignItems: 'center',
      margin: 20
  },
  });
export default CustomFoodScreen;