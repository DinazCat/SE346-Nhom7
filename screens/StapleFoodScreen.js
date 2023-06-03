import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import { useDispatch } from "react-redux";
import { Add } from "../store/CustomFoodSlice";
import { useSelector } from "react-redux";

import PopFoodAmount from "./PopFoodAmount";
const stapleFood = [
  {id: 1,
    image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg', 
    name: 'Bananas', 
    catagory: 'Fruit',
    calories:'120', unit:'g', baseAmount:'100'
  },
  {id: 2,
    image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg', 
    name: 'Apple', 
    catagory: 'Fruit',
    calories: '239', unit:'g', baseAmount:'100'
    },
    {id: 3,
      image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg', 
      name: 'Apple', 
      catagory: 'Fruit',
      calories: '239', unit:'g', baseAmount:'100'
      },
      {id: 4,
        image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg', 
        name: 'Apple', 
        catagory: 'Fruit',
        calories: '239', unit:'g', baseAmount:'100'
        },
        {id: 5,
          image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg', 
          name: 'Apple', 
          catagory: 'Fruit',
          calories: '239', unit:'g', baseAmount:'100'
          },
]

const StapleFoodScreen = ({route}) => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  //lưu dữ liệu đồ ăn
  const [unit, setUnit] = useState();
  const [baseAmount, setBaseAmount] = useState('');
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState();
  const [selectedItem, setSelectedItem] = useState(null);//can edit

  const dispatch = useDispatch();
  const isCustomFood = useSelector((state) => state.IngredientList.isCustomFood);

  const [textInput, onChangeTextInput] = useState('');//tìm kiếm
  const [textSearch, onChangeTextSearch] = useState('');//nhập gram
  const [ingredient, setIngredient] = useState('');
  
  //modal
  const [visible, setVisible] = React.useState(false);
  //add ingredient
  const isAddIngredient = () => {
    
      if (textSearch==""){
        //just space
      }
      else{
        if (isCustomFood == false){
      setVisible(false);
      //add food and foodDiary
      firestore().collection('foodsDiary').add({
        userId: user.uid,
        time: moment(new Date()).format('DD/MM/YYYY'),
        name: name,
        mealType: 'Breakfast',
        amount: textSearch,
        calories: (parseInt(textSearch) * parseInt(calories) / parseInt(baseAmount)).toFixed(),
        image: image,
        isCustom: false
      })
    }
    else{
      const resultCalories = (parseInt(textSearch) * parseInt(calories) / parseInt(baseAmount)).toFixed();
      dispatch(Add(image, name, calories, unit, baseAmount, resultCalories, textSearch));
      navigation.navigate('AddCustomFood')
    }
      
    }
  
  
    
  }
  

  const ShowAddAmount = (item) => {
    onChangeTextSearch('');
    setCalories(item.calories);
    setBaseAmount(item.baseAmount);
    setUnit(item.unit);
    setImage(item.image);
    setName(item.name);
    setSelectedItem(item);
    setVisible(true);
  }


  
  return (
    <View styles={{flex:1}}>
      <View style={{flexDirection:'row'}}>
        <Icon name={'search'} />
        <TextInput
        value={textInput}
        onChangeText={onChangeTextInput}
        placeholder="Search food"
        placeholderTextColor={'rgba(0,0,0,0.8)'}
        />
        </View>
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
            source={{uri:image}}
            style={{height: 100, width: 100, marginVertical: 10}}
          />
        </View>
        <View >
        <TextInput style={{marginVertical: 30, fontSize: 20}} value={textSearch} onChangeText={textSearch  =>onChangeTextSearch(textSearch)}/>
        <Text>{calories}cals/{baseAmount}{unit}</Text>
        </View>
        <TouchableOpacity style={{marginVertical: 30, fontSize: 20, textAlign: 'center'}} onPress={()=>isAddIngredient()}>
          <Text>Add</Text>
        </TouchableOpacity>
      </PopFoodAmount>
        <View >
          <FlatList 
              data={stapleFood.filter(item=>item.name.toLowerCase().includes(textInput.toLowerCase()))
              }
              renderItem={({item}) => (
                <TouchableOpacity  onPress={() => ShowAddAmount(item)}>
                  <View >
                      <Image source = {{uri: item.image}} style={{width: 30,
        height: 30,
        resizeMode: 'stretch'}}/>
                      <Text > {item.name} </Text>
                      <Text> {item.catagory} </Text>
                      <Text > {item.calories}cals/{item.baseAmount}{item.unit} </Text>
                  </View>

                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
          />
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
export default StapleFoodScreen;