import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import { useSelector } from "react-redux";
const EditExerciseScreen = ({route}) => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [textInput, onChangeTextInput] = useState(route.params?.item.amount||'');
  const language = useContext(LanguageContext);
  const tempTime = useSelector((state)=>state.CaloriesDiary.time)
  const time = (tempTime=='Today'? moment(new Date()).format('DD/MM/YYYY'): tempTime)
  const isEdit = route.params?.isEdit
  const baseCalories = isEdit? route.params?.item.baseCalories:route.params?.item.calories
 
  const theme = useContext(ThemeContext);
  const back = () => {
    navigation.goBack();
  }
  const editExercise = () => {
    
      if (textInput==""){
        Alert.alert(language==='vn'?'Giá trị cần nhập không thể để trống':'Input cannot be blank')
      }
      else{
        firestore().collection('exercise').doc(route.params?.item.id).update({
            amount: textInput,
            calories: (parseFloat(textInput) * parseInt(route.params?.item.baseCalories) / 60).toFixed(),
        })
        Alert.alert(language==='vn'?'Cập nhật thành công':'Successfully updated')
        navigation.goBack();
    }
  }
  const addExercise = async() => {
    
    if (textInput==""){
      Alert.alert(language==='vn'?'Giá trị cần nhập không thể để trống':'Input cannot be blank')
    }
    else{
      await firestore().collection('exercise').add({
        userId: user.uid,
        time: time,
        image: route.params?.item.image,
        amount: textInput,
        name: route.params?.item.name,
        isChecked: false,
        baseCalories: route.params?.item.calories,
        calories: (parseFloat(textInput) * parseInt(route.params?.item.calories) / 60).toFixed(),
        
      })
      Alert.alert(
        language==='vn'?'Thêm thành công':'Successfully added'
    )
      navigation.navigate('Home', { screen: 'DetailExerciseScreen', params: {time: time}})
  }
}
  

  
  return (
    <View style={{backgroundColor: theme==='light'?"#fff":"#000", flex: 1}}>
        <TouchableOpacity style={{marginLeft: 15, marginVertical: 5}} onPress={back}>
    <Icon name={'arrow-left'} size={25} color={theme==='light'?"#000":"#fff"}/>
  </TouchableOpacity>
        <View style={{alignItems: 'center', justifyContent:'center', flexDirection: 'row'}}>
          <Image
            source={{uri: route.params?.item.image}}
            style={{height: 110, width: 110, marginVertical: 10, resizeMode: 'stretch'}}
          />
          <View style={{marginStart: 15}}>
            <Text style={{fontSize: 16, width: 150, color: theme==='light'?"#000":"#fff"}}>{route.params?.item.name}</Text>
            <Text style={{fontSize: 16, color: theme==='light'?"#000":"#fff"}}>{baseCalories} cals/h</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
        <TextInput keyboardType = 'number-pad' style={[styles.textInput, {width: 270, color: theme==='light'?"#000":"#fff", borderColor: theme==='light'?"#000":"#fff"}]} autoFocus={true} value={textInput} onChangeText={textInput=>{
                    if (+textInput||textInput== "") {
                      onChangeTextInput(textInput)
                    }
                    
                    }} />
        <Text style={[styles.text, {color: theme==='light'?"#000":"#fff"}]}>min</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 15, marginLeft: 45}}>
        <Text style={{color: theme==='light'?"#000":"#fff", fontSize: 18, fontWeight: 'bold'}}>Calories: </Text>
        <Text style={{color: theme==='light'?"#000":"#fff", fontSize: 18, width: 165}}>{(parseFloat(textInput==''?'0': textInput) * parseInt(baseCalories) / 60).toFixed()}</Text>
        <Text style={{color: theme==='light'?"#000":"#fff", fontSize: 18}}> cals</Text>
        </View>
        {isEdit?<TouchableOpacity style={styles.button} onPress={()=>editExercise()}>
          <Text style={styles.text}>{language === 'vn' ? 'Lưu' : 'Save'}</Text>
        </TouchableOpacity>:<TouchableOpacity style={styles.button} onPress={()=>addExercise()}>
          <Text style={styles.text}>{language === 'vn' ? 'Thêm' : 'Add'}</Text>
        </TouchableOpacity>}
          
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
  alignSelf: 'center',
},
  });
export default EditExerciseScreen;