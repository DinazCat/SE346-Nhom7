import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";

import PopFoodAmount from "./PopFoodAmount";
const exercises = [
  {id: 1,
    image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg', 
    name: 'Run', 
    calories:'120'
  },
  {id: 2,
    image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg', 
    name: 'Walk', 
    calories: '239'
    },
    {id: 3,
      image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg', 
      name: 'Swim', 
      calories: '239'}
]

const AddExerciseScreen = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState();

  const [textInput, onChangeTextInput] = useState('');
  const [textSearch, onChangeTextSearch] = useState('');
  
  //modal
  const [visible, setVisible] = React.useState(false);

  const language = useContext(LanguageContext);
  //add ingredient
  const addExercise = () => {
    
      if (textInput==""){
        //just space
      }
      else{
      setVisible(false);
      //add food and foodDiary
      firestore().collection('exercise').add({
        userId: user.uid,
        time: moment(new Date()).format('DD/MM/yyyy'),
        image: image,
        isDelete: false,
        calories: (parseInt(textInput) * parseInt(calories) ).toFixed(),
        
        
      })
      navigation.navigate('AddExercise')
    }
  
    
  }
  

  const ShowAddAmount = (item) => {
    onChangeTextInput('');
    setCalories(item.calories);
    setImage(item.image);
    setName(item.name);
    setVisible(true);
  }


  
  return (
    <View styles={{flex:1}}>
      <View style={{flexDirection:'row'}}>
        <Icon name={'search'} />
        <TextInput
        value={textSearch}
        onChangeText={onChangeTextSearch}
        placeholder={language === 'vn' ? 'Tìm kiếm bài tập' : 'Search excercise'}
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
        <TextInput style={{marginVertical: 30, fontSize: 20}} value={textInput} onChangeText={textInput  =>onChangeTextInput(textInput)}/>
        <Text>{calories}cals/h</Text>
        </View>
        <TouchableOpacity style={{marginVertical: 30, fontSize: 20, textAlign: 'center'}} onPress={()=>addExercise()}>
          <Text>{language === 'vn' ? 'Thêm' : 'Add'}</Text>
        </TouchableOpacity>
      </PopFoodAmount>
        <View >
          <FlatList 
              data={exercises.filter(item=>item.name.toLowerCase().includes(textSearch.toLowerCase()))
              }
              renderItem={({item}) => (
                <TouchableOpacity  onPress={() => ShowAddAmount(item)}>
                  <View >
                      <Image source = {{uri: item.image}} style={{width: 30,
        height: 30,
        resizeMode: 'stretch'}}/>
                      <Text > {item.name} </Text>
                      <Text > {item.calories}cal/{item.baseAmount}{item.unit} </Text>
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
export default AddExerciseScreen;