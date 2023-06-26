import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import moment from "moment";
import * as Progress from 'react-native-progress';
import { AuthContext } from '../navigation/AuthProvider';
import { useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import { useSelector } from "react-redux";

const EditFoodScreen = ({route}) => {
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const baseGoal = useSelector((state)=>state.CaloriesDiary.baseGoal);
  const exercise = useSelector((state)=>state.CaloriesDiary.exercise);
  const caloriesBudget = parseInt(baseGoal) + parseInt(exercise);
  const [textInput, onChangeTextInput] = useState(route.params?.item.amount|'');
  const tempTime = useSelector((state)=>state.CaloriesDiary.time)
  const time = (tempTime=='Today'? moment(new Date()).format('DD/MM/YYYY'): tempTime)
  const [selectedValue, setSelectedValue] = useState(route.params?.mealType||'Breakfast');
  const isEdit = route.params?.isEdit;
  const baseCalories = isEdit? route.params?.item.baseCalories:route.params?.item.calories;
  const baseFat = isEdit? route.params?.item.baseFat:route.params?.item.fat;
  const baseCarbs = isEdit? route.params?.item.baseCarbs:route.params?.item.carbs;
  const baseProtein = isEdit? route.params?.item.baseProtein:route.params?.item.protein;
  const back = () => {
    navigation.goBack();
  }
  const Edit = async() => {
    
      if (textInput==""){
        //just space
      }
      else{
      await firestore().collection('foodsDiary').doc(route.params?.item.id).update({
        mealType: selectedValue,
        amount: textInput,
        carbs: (parseFloat(textInput) * parseInt(route.params?.item.baseCarbs) / parseInt(route.params?.item.baseAmount)).toFixed(),
        fat: (parseFloat(textInput) * parseInt(route.params?.item.baseFat) / parseInt(route.params?.item.baseAmount)).toFixed(),
        protein: (parseFloat(textInput) * parseInt(route.params?.item.baseProtein) / parseInt(route.params?.item.baseAmount)).toFixed(),
        calories: (parseFloat(textInput) * parseInt(route.params?.item.baseCalories) / parseInt(route.params?.item.baseAmount)).toFixed(),
      })
      navigation.goBack();
    }
  }
  const Add = () => {
    if (textInput==""){
      //just space
    }
    else{
    navigation.goBack();
    firestore().collection('foodsDiary').add({
      userId: user.uid,
      time: time,
      name: route.params?.item.name,
      unit: route.params?.item.unit,
      mealType: selectedValue,
      amount: textInput,
      carbs: (parseFloat(textInput) * parseInt(route.params?.item.carbs) / parseInt(route.params?.item.baseAmount)).toFixed(),
      fat: (parseFloat(textInput) * parseInt(route.params?.item.fat) / parseInt(route.params?.item.baseAmount)).toFixed(),
      protein: (parseFloat(textInput) * parseInt(route.params?.item.protein) / parseInt(route.params?.item.baseAmount)).toFixed(),
      baseFat: route.params?.item.fat,
      baseCarbs: route.params?.item.carbs,
      baseProtein: route.params?.item.protein,
      baseAmount: route.params?.item.baseAmount,
      baseCalories: route.params?.item.calories,
      calories: (parseFloat(textInput) * parseInt(route.params?.item.calories) / parseInt(route.params?.item.baseAmount)).toFixed(),
      image: route.params?.item.image,
      isCustom: false,
      isChecked: false
    })
  }
  }

  
  return (
    <View style={{backgroundColor: theme==='light'?"#fff":"#000", flex: 1}}>
        <TouchableOpacity style={{marginLeft: 15, marginVertical: 5}} onPress={back}>
    <Icon name={'arrow-left'} size={25} color={theme==='light'?"#000":"#fff"}/>
  </TouchableOpacity>
      
        <View style={{alignItems: 'center'}}>
          
        </View>
        <View style={{alignItems: 'center', justifyContent:'center', flexDirection: 'row'}}>
          <Image
            source={{uri:route.params?.item.image}}
            style={{height: 110, width: 110, marginVertical: 10}}
          />
          <View style={{marginStart: 15}}>
            <Text style={{fontSize: 16, width: 150, color: theme==='light'?"#000":"#fff"}}>{route.params?.item.name}</Text>
            <Text style={{fontSize: 16, color: theme==='light'?"#000":"#fff"}}>{baseCalories} cals/{(route.params?.item.baseAmount!='1')?route.params?.item.baseAmount+" ":''}{route.params?.item.unit}</Text>
          </View>
        </View>
        <View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
        <TextInput style={[styles.textInput, {width: 275, color: theme==='light'?"#000":"#fff", borderColor: theme==='light'?"#000":"#fff"}]} autoFocus={true} value={textInput} onChangeText={textInput  =>onChangeTextInput(textInput)}/>
        <Text style={[styles.text, {color: theme==='light'?"#000":"#fff"}]}>{route.params?.item.unit}</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15, marginLeft: 45}}>
        <Text style={{color: theme==='light'?"#000":"#fff", fontSize: 18, fontWeight: 'bold'}}>Calories: </Text>
        <Text style={{color: theme==='light'?"#000":"#fff", fontSize: 18, width: 165}}>{(parseFloat(textInput==''?'0':textInput) * parseInt(route.params?.item.calories) / parseInt(route.params?.item.baseAmount)).toFixed()}</Text>
        <Text style={{color: theme==='light'?"#000":"#fff", fontSize: 18}}> cals</Text>
        </View>
        <View style={{marginHorizontal: 15, marginTop: 7}}>
        <View style={{marginVertical:3}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#5ADFC8', marginRight: 5}}>Carbs</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{textInput==''?baseCarbs: (parseFloat(textInput) * parseInt(baseCarbs) / parseInt(route.params?.item.baseAmount)).toFixed()}g, {(parseInt(textInput==''?baseCarbs: (parseFloat(textInput) * parseInt(baseCarbs) / parseInt(route.params?.item.baseAmount)).toFixed())*40000/(caloriesBudget*45)).toFixed()}% {language=='vn'?'của Mục tiêu':'of Target'}</Text>
        </View>
        <Progress.Bar progress={parseInt(textInput == ''?baseCarbs:(parseFloat(textInput) * parseInt(baseCarbs) / parseInt(route.params?.item.baseAmount)).toFixed())*400/(caloriesBudget*45)} width={380} color="#5ADFC8"/>
        </View>
        <View style={{marginVertical:3}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#CE65E0', marginRight: 5}}>{language==='vn'?'Chất đạm':'Protein'}</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{textInput==''?baseProtein: (parseFloat(textInput) * parseInt(baseProtein) / parseInt(route.params?.item.baseAmount)).toFixed()}g, {(parseInt(textInput==''?baseProtein:(parseFloat(textInput) * parseInt(baseProtein) / parseInt(route.params?.item.baseAmount)).toFixed())*2000/(caloriesBudget)).toFixed()}% {language=='vn'?'của Mục tiêu':'of Target'}</Text>
        </View>
        <Progress.Bar progress={parseInt(textInput==''?baseProtein:(parseFloat(textInput) * parseInt(baseProtein) / parseInt(route.params?.item.baseAmount)).toFixed())*20/(caloriesBudget)} width={380} color="#CE65E0"/>
        </View>
        <View style={{marginVertical:3}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#E8B51A', marginRight: 5}}>{language==='vn'?'Chất béo':'Fat'}</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{textInput==''?baseFat:(parseFloat(textInput) * parseInt(baseFat) / parseInt(route.params?.item.baseAmount)).toFixed()}g, {(parseInt(textInput==''?baseFat:(parseFloat(textInput) * parseInt(baseFat) / parseInt(route.params?.item.baseAmount)).toFixed())*90000/(caloriesBudget*35)).toFixed()}% {language=='vn'?'của Mục tiêu':'of Target'}</Text>
        </View>
        <Progress.Bar progress={parseInt(textInput==''?baseFat:(parseFloat(textInput) * parseInt(baseFat) / parseInt(route.params?.item.baseAmount)).toFixed())*900/(caloriesBudget*35)} width={380} color="#E8B51A"/>
        </View>
        
        <Picker
        selectedValue={selectedValue}
        dropdownIconColor = {theme === 'light'? '#000':'#fff'}
        style={{ height: 50, width: 200, alignSelf: 'center', color: theme === 'light'? '#000' : '#fff'}}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label={language==='vn'? 'Buổi sáng': 'Breakfast'} value="Breakfast" />
        <Picker.Item label={language==='vn'? 'Buổi trưa': 'Lunch'}  value="Lunch" />
        <Picker.Item label={language==='vn'? 'Buổi tối': 'Dinner'}  value="Dinner" />
        <Picker.Item label={language==='vn'? 'Ăn vặt': 'Snacks'}  value="Snacks" />
      </Picker>

        </View>
        {isEdit?<TouchableOpacity style={styles.button} onPress={()=>Edit()}>
          <Text style={styles.text}>{language === 'vn' ? 'Lưu' : 'Save'}</Text>
        </TouchableOpacity>:<TouchableOpacity style={styles.button} onPress={()=>Add()}>
          <Text style={styles.text}>{language === 'vn' ? 'Thêm' : 'Add'}</Text>
        </TouchableOpacity>}
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
      padding: 10,
      fontSize: 18,
      height: 50,
      textAlign: 'center'
  },
  textInfo: {
    fontSize: 18,
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
export default EditFoodScreen;