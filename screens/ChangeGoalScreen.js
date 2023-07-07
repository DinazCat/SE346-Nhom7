import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext, useEffect} from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Popover from 'react-native-popover-view';
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
const ChangeGoalScreen = ({route, navigation}) => {
  const {user} = useContext(AuthContext);
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext)
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState('');
  useEffect(() => {
    getGoal();
  }, []);
  const cancel = () => {
    navigation.goBack();
  }
  const getGoal = () => {
    firestore()
    .collection('bmi')
    .doc(user.uid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        setWeeklyGoal(documentSnapshot.data().weeklyGoal == "0"? '0.25':documentSnapshot.data().weeklyGoal);
        setActivityLevel(documentSnapshot.data().activityLevel);
        setGoal(documentSnapshot.data().goal);
      }
    });
  }
  const CaloriesNeedToBurn = (age, height, weight, activityLevel, goal, sex, weeklyGoal)=>{
    let bmr = 0;
    
    if (sex == 'Male'){
      bmr = 10 * parseInt(weight) + 6.25 * parseInt(height) - 5 * parseInt(age) + 5;
    }
    else {
      bmr = 10 * parseInt(weight) + 6.25 * parseInt(height) - 5 * parseInt(age) - 161;
    }
    switch (activityLevel){
      case "Not very active":
        bmr = (bmr * 1.2).toFixed();
        break;
      case "Lightly active":
        bmr = (bmr * 1.375).toFixed();
        break;
      case "Moderate":
        bmr = (bmr * 1.55).toFixed();
        break;
      case "Active":
        bmr = (bmr * 1.725).toFixed();
        break;
      case "Very active":
        bmr = (bmr * 1.9).toFixed();
        break;
    }
    switch(goal){
      case "Gain weight":
        bmr = parseInt(bmr) + parseFloat(weeklyGoal) * 1000;
        break;
      case "Lose weight":
        bmr = bmr - parseFloat(weeklyGoal) * 1000;
        break;
    }
    
  
  
    return bmr;
  }
  

const updateGoal = async () => {
  
  return new Promise((resolve, reject) => {
  const unsubscribe = firestore()
  .collection('bmiDiary')
  .where('userId', '==', user.uid)
  .onSnapshot((querySnapshot)=>{
    let arr = [];
    querySnapshot.forEach(doc =>{
      const {time, age, height, weight, sex} = doc.data();
      arr.push({time: time, id: doc.id, age: age, height: height, weight: weight, sex: sex})
      
    })
    let arrSort = arr.sort((a,b)=>a.time - b.time);
    let item = arrSort[arrSort.length - 1];
      resolve(item);
    },
    (error) => {
      console.log(error);
      reject([]);
    }
  );
  return () => unsubscribe();
});
};

const updateBmr = async() => {
  const item = await updateGoal();
  
    firestore().collection('bmiDiary').add({
      bmr: CaloriesNeedToBurn(item.age, item.height, item.weight, activityLevel, goal, item.sex, weeklyGoal),
      userId: user.uid,
      age: item.age,
      height: item.height,
      weight: item.weight,
      sex: item.sex,
      goal: goal,
      weeklyGoal: (goal == 'Maintain weight')? '0': weeklyGoal,
      activityLevel: activityLevel,
      time: firestore.Timestamp.fromDate(new Date()),
    });
  

}
  const save = async() => {
    try{
        
        await updateBmr();
        await firestore().collection('bmi').doc(user.uid).update({
            goal: goal,
            activityLevel: activityLevel,
            weeklyGoal: (goal == 'Maintain weight')? '0': weeklyGoal,
          }).then(() => {
            console.log('User Updated!');
            Alert.alert(
              'Profile Updated!',
              'Your Profile has been updated successfully.'
            );
          });
          
    }
    catch(e){
        console.log(e);
    };
  }
  
  return (
    <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 15, backgroundColor: theme === 'light' ?'#2AE371': '#747474'}}>
      <TouchableOpacity onPress={cancel}>
        <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Hủy' : 'Cancel'}</Text>
      </TouchableOpacity>
      <Text style={{fontSize: 23, color: '#fff', fontWeight: 'bold', textAlign: 'center', width: 250}}>{language === 'vn' ? 'Thay đổi mục tiêu' : 'Change goal'}</Text>
      
      <TouchableOpacity onPress={save}>
        <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Lưu' : 'Save'}</Text>
      </TouchableOpacity>
      </View>
      <View style={{marginTop: 20}}>
      
      <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 5, borderColor: theme==='light'?"#000":"#fff", borderWidth: 1, borderRadius: 13, height: 65}}>
        <Text style={{fontSize: 17, marginStart: 3, color: theme==='light'?'#000':'#fff'}}>{language === 'vn' ? 'Mức độ tập luyện: ' : 'Activity level:'}</Text>
      {activityLevel?<Picker
        selectedValue={activityLevel}
        dropdownIconColor = {theme === 'light'? '#000':'#fff'}
        style={{ height: 50, width: 210, alignSelf: 'center', color: theme === 'light'? '#000' : '#fff'}}
        onValueChange={(itemValue, itemIndex) => setActivityLevel(itemValue)}
      >
        <Picker.Item label={language==='vn'?'Không năng động':'Not very active'} value="Not very active" />
        <Picker.Item label={language==='vn'?'Khá năng động':'Lightly active'} value="Lightly active" />
        <Picker.Item label={language==='vn'?'Bình thường':'Moderate'} value="Moderate" />
        <Picker.Item label={language==='vn'?'Năng động':'Active'} value="Active" />
        <Picker.Item label={language==='vn'?'Cực năng động':'Very active'} value="Very active" />
      </Picker>: null}
      
      </View>
      <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 5, borderColor: theme==='light'?"#000":"#fff", borderWidth: 1, borderRadius: 13, marginTop: 10, height: 65}}>
        <Text style={{fontSize: 17, marginStart: 3, color: theme==='light'?'#000':'#fff'}}>{language === 'vn' ? 'Mục tiêu: ' : 'Goal:'}</Text>
      {goal?<Picker
        selectedValue={goal}
        dropdownIconColor = {theme === 'light'? '#000':'#fff'}
        style={{ height: 50, width: 220, alignSelf: 'center', color: theme === 'light'? '#000' : '#fff'}}
        onValueChange={(itemValue, itemIndex) => setGoal(itemValue)}
      >
        <Picker.Item label={language==='vn'?'Giảm cân':'Lose weight'} value="Lose weight" />
        <Picker.Item label={language==='vn'?'Giữ cân':'Maintain weight'} value="Maintain weight" />
        <Picker.Item label={language==='vn'?'Tăng cân':'Gain weight'} value="Gain weight" />
        
      </Picker>:null}
      
      </View>
      <View style={{marginHorizontal: 5, borderColor: theme==='light'?"#000":"#fff", borderWidth: 1, borderRadius: 13, marginTop: 10, height: 85}}>
        <Text style={{fontSize: 17, marginStart: 3, color: theme==='light'?'#000':'#fff'}}>{language === 'vn' ? 'Mục tiêu mỗi tuần: ' : 'Weekly goal:'}</Text>
      {(goal!='Maintain weight' && goal)?<Picker
        selectedValue={weeklyGoal}
        dropdownIconColor = {theme === 'light'? '#000':'#fff'}
        style={{width: 300, alignSelf: 'center', color: theme === 'light'? '#000' : '#fff'}}
        onValueChange={(itemValue, itemIndex) => setWeeklyGoal(itemValue)}
      >
        <Picker.Item label={(language==='vn'? (goal=='Lose weight'? 'Giảm':'Tăng'):(goal=='Lose weight'? 'Lose':'Gain')) + " 0.25 kg per week"} value="0.25" />
        <Picker.Item label={(language==='vn'? (goal=='Lose weight'? 'Giảm':'Tăng'):(goal=='Lose weight'? 'Lose':'Gain')) + " 0.5 kg per week"} value="0.5" />
        <Picker.Item label={(language==='vn'? (goal=='Lose weight'? 'Giảm':'Tăng'):(goal=='Lose weight'? 'Lose':'Gain')) + " 1 kg per week"} value="1" />
        
      </Picker>: null}
      
      </View>
      
          </View>
     
      </View>

)
}
const styles = StyleSheet.create({
  text: {
    fontSize: 17
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 15,
    
  },
  icon: {
    width: 25,
    height: 25,
    
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
    textInput: {
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 17,
      height: 60,
      width: "90%",
      alignSelf: 'center',
      marginBottom: 10
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
export default ChangeGoalScreen;