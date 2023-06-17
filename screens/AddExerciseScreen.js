import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";

import PopFoodAmount from "./PopFoodAmount";
const exercises = [
  {
    image: 'https://cdn-icons-png.flaticon.com/512/5147/5147283.png', 
    name: 'Walking', 
    calories:'148'
  },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/5778/5778454.png', 
    name: 'Bicycling', 
    calories: '321'
    },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/4721/4721050.png', 
    name: 'Running', 
    calories: '296'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/886/886860.png', 
    name: 'Abdominal', 
    calories: '123'},
  {
    image: 'https://w7.pngwing.com/pngs/639/110/png-transparent-pink-and-black-game-controller-illustration-video-game-gamepad-joystick-icon-the-game-console-game-cartoon-handle.png', 
    name: 'Activity Video Game', 
    calories: '138'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/6901/6901517.png', 
    name: 'Aerobic', 
    calories: '311'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/184/184101.png', 
    name: 'Archery', 
    calories: '163'},
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Backpack_icon.svg/2048px-Backpack_icon.svg.png', 
    name: 'Backpacking', 
    calories: '296'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/2828/2828920.png', 
    name: 'Badminton', 
    calories: '222'},
  {
    image: 'https://static.vecteezy.com/system/resources/previews/013/396/214/original/baseball-ball-icon-png.png', 
    name: 'Baseball', 
    calories: '197'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/889/889455.png', 
    name: 'Basketball', 
    calories: '271'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/2548/2548440.png', 
    name: 'Bench Press', 
    calories: '123'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/3456/3456464.png', 
    name: 'Yoga', 
    calories: '74'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/4658/4658048.png', 
    name: 'Wrestling', 
    calories: '247'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/3440/3440961.png', 
    name: 'Water activities', 
    calories: '212'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/2503/2503554.png', 
    name: 'Windsurfing', 
    calories: '197'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/2634/2634025.png', 
    name: 'Weight Training', 
    calories: '123'},
  {
    image: 'https://static.vecteezy.com/system/resources/previews/016/772/785/non_2x/mountain-biking-illustration-with-cycling-down-the-mountains-for-sports-leisure-and-healthy-lifestyle-in-flat-cartoon-hand-drawn-templates-vector.jpg', 
    name: 'Bicycling Mountain', 
    calories: '370'},
  {
    image: 'https://bikeles.com/wp-content/uploads/2022/09/recumbent.jpg', 
    name: 'Bicycling Recumbent', 
    calories: '148'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/5021/5021952.png', 
    name: 'Billiards', 
    calories: '74'},
  {
    image: 'https://cdn-icons-png.flaticon.com/512/3976/3976384.png', 
    name: 'Bowling', 
    calories: '99'},

]

const AddExerciseScreen = (props) => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');

  const [textInput, onChangeTextInput] = useState('');
  const [textSearch, onChangeTextSearch] = useState('');//nhớ để . là số thập phân
  
  //modal
  const [visible, setVisible] = useState(false);
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const addExercise = () => {
    
      if (textInput==""){
        //just space
        
      }
      else{
      setVisible(false);
      //add food and foodDiary
      firestore().collection('exercise').add({
        userId: user.uid,
        time: props.date,
        image: image,
        amount: textInput,
        name: name,
        isDelete: false,
        calories: (parseFloat(textInput) * parseInt(calories) / 60).toFixed(),
        
        
      })
      if(props.isNavigation){
        navigation.goBack();
      }
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
      <View style={{flexDirection:'row', marginTop: 10, marginHorizontal: 10, alignItems: 'center'}}>
      <Icon name={'search'} size={25} color={theme==='light'?'#000':'#fff'}/>
        <TextInput
        style={[styles.textInput, {marginStart: 7, fontSize: 17, color: theme==='light'?"#000":"#fff", borderColor: theme==='light'?"#000":"#fff"}]}
        value={textSearch}
        onChangeText={onChangeTextSearch}
        placeholder={language === 'vn' ? 'Tìm kiếm bài tập' : 'Search excercise'}
        placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
        />
        </View>
        <PopFoodAmount visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={{uri: 'https://static.vecteezy.com/system/resources/previews/018/887/462/original/signs-close-icon-png.png'}}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center', justifyContent:'center', flexDirection: 'row'}}>
          <Image
            source={{uri:image}}
            style={{height: 110, width: 110, marginVertical: 10}}
          />
          <View style={{marginStart: 15}}>
            <Text style={{fontSize: 16, width: 150}}>{name}</Text>
            <Text style={{fontSize: 16}}>{calories}cals/h</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
        <TextInput style={[styles.textInput, {width: 240}]} autoFocus={true} value={textInput} onChangeText={textInput  =>onChangeTextInput(textInput)}/>
        <Text style={styles.text}>min</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={()=>addExercise()}>
          <Text style={styles.text}>{language === 'vn' ? 'Thêm' : 'Add'}</Text>
        </TouchableOpacity>
      </PopFoodAmount>
          <FlatList style={{marginTop: 10}}
              data={exercises.filter(item=>item.name.toLowerCase().includes(textSearch.toLowerCase()))
              }
              renderItem={({item}) => (
                <TouchableOpacity  onPress={() => ShowAddAmount(item)}>
                  <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 15, marginVertical: 3, borderBottomWidth: 2, borderBottomColor: theme==='light'? '#000': '#fff', paddingBottom: 5, flex: 1}}>
                      <Image source = {{uri: item.image}} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <Text style={{fontSize: 18, width: 200, marginStart: 3, color: theme==='light'?"#000":"#fff"}}>{item.name}</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2'}}>{item.calories} cal/h</Text>
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
    padding: 10,
    fontSize: 18,
    height: 50,
    textAlign: 'center'
},

  tabIcon: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    height: 50,
},
button: {
  marginTop: 15,
  borderRadius: 20,
  width: '40%',
  padding: 5,
  backgroundColor: '#2AE371',
  alignSelf: 'center'
},
  });
export default AddExerciseScreen;