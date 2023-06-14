import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert} from "react-native";
import ProgressCircle from 'react-native-progress-circle'
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from "../navigation/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import LanguageContext from "../context/LanguageContext";
import moment from 'moment';
const HomeScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const language = useContext(LanguageContext);
  const [baseGoal, setBaseGoal] = useState(0);
  const [exercise, setExercise] = useState(0);
  const [water, setWater] = useState(0);
  const [breakfast, setBreakfast] = useState(0);
  const [lunch, setLunch] = useState(0);
  const [dinner, setDinner] = useState(0);
  const [snacks, setSnacks] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isOver, setIsOver] = useState('Remaining');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [time, setTime] = useState('Today');

  //View All
  const viewAll = () => {
    navigation.navigate("DetailHomeScreen", {time: time})
  }
  const takeNote = () => {
    navigation.navigate("TakeNoteScreen", {time: time})
  }
  const viewWater = () => {
    navigation.navigate('DetailWaterScreen', {time: time})
  }
  const viewExercise = () => {
    navigation.navigate('DetailExerciseScreen', {time: time})
  }
  const viewMeal = (mealType) => {
    navigation.navigate('DetailMealScreen', {time: time, mealType: mealType})
  }
  
  useEffect(() => {
    getWater(moment(new Date()).format('DD/MM/YYYY'))
    getExercise(moment(new Date()).format('DD/MM/YYYY'))
    getBreakfast(moment(new Date()).format('DD/MM/YYYY'))
    getLunch(moment(new Date()).format('DD/MM/YYYY'))
    getDinner(moment(new Date()).format('DD/MM/YYYY'))
    getSnacks(moment(new Date()).format('DD/MM/YYYY'))
    getBaseGoal(new Date());
    //setRemaining(parseInt(baseGoal)+parseInt(exercise)-parseInt(breakfast)- parseInt(snacks)- parseInt(lunch)-parseInt(dinner));
   }, []);
  
  const getWater = (date)=> {
    try{
      firestore()
      .collection('water')
      .where("userId", '==', user.uid)
      .where("time", '==', date)
      .onSnapshot((querySnapshot)=>{
        let totalWater = 0;
        querySnapshot.forEach(doc =>{
          const {amount} = doc.data();
          totalWater += parseInt(amount);
        })
        setWater(totalWater);
        
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getExercise = (date)=> {
    try{
      firestore()
      .collection('exercise')
      .where("userId", '==', user.uid)
      .where("time", '==', date)
      .onSnapshot((querySnapshot)=>{
        let totalExercise = 0;
        querySnapshot.forEach(doc =>{
          const {calories} = doc.data();
          totalExercise += parseInt(calories);
        })
        setExercise(totalExercise);
        
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getBreakfast = (date)=> {
    try{
      firestore()
      .collection('foodsDiary')
      .where("userId", '==', user.uid)
      .where("time", '==', date)
      .where("mealType", '==', 'Breakfast')
      .onSnapshot((querySnapshot)=>{
        let totalBreakfast = 0;
        querySnapshot.forEach(doc =>{
          const {calories} = doc.data();
          totalBreakfast += parseInt(calories);
        })
        setBreakfast(totalBreakfast);
        
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getLunch = (date)=> {
    try{
      firestore()
      .collection('foodsDiary')
      .where("userId", '==', user.uid)
      .where("time", '==', date)
      .where("mealType", '==', 'Lunch')
      .onSnapshot((querySnapshot)=>{
        let totalLunch = 0;
        querySnapshot.forEach(doc =>{
          const {calories} = doc.data();
          totalLunch += parseInt(calories);
        })
        setLunch(totalLunch);
        
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getDinner = (date)=> {
    try{
      firestore()
      .collection('foodsDiary')
      .where("userId", '==', user.uid)
      .where("time", '==', date)
      .where("mealType", '==', 'Dinner')
      .onSnapshot((querySnapshot)=>{
        let totalDinner = 0;
        querySnapshot.forEach(doc =>{
          const {calories} = doc.data();
          totalDinner += parseInt(calories);
        })
        setDinner(totalDinner);
        
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getSnacks = (date)=> {
    try{
      firestore()
      .collection('foodsDiary')
      .where("userId", '==', user.uid)
      .where("time", '==', date)
      .where("mealType", '==', 'Snacks')
      .onSnapshot((querySnapshot)=>{
        let totalSnacks = 0;
        querySnapshot.forEach(doc =>{
          const {calories} = doc.data();
          totalSnacks += parseInt(calories);
        })
        setSnacks(totalSnacks);
        
      })
     
    } catch(e){
      console.log(e);
    }
  }
  //get base goal
  const getBaseGoal = (date) => {
    try{
      firestore()
      .collection('bmiDiary')
      .where('id', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrTemp = [];
        querySnapshot.forEach(doc =>{
          const {bmr, time} = doc.data();
          let d = new Date(time._seconds * 1000);
          arr.push({bmr: bmr, time: time})
          if (d.getFullYear()< date.getFullYear()|| (d.getMonth() < date.getMonth() && d.getFullYear()===date.getFullYear()) || (d.getDate()<=date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear())){
            arrTemp.push({bmr: bmr, time: time})
          }
        })
        let arrSort = arr.sort((a,b)=>a.time - b.time);
        let arrTempSort = arrTemp.sort((a,b)=>a.time - b.time);
        if (arrTempSort.length == 0){
          setBaseGoal(arrSort[0].bmr);
        }
        else{
          setBaseGoal(arrTempSort[arrTempSort.length - 1].bmr)
        }
      })
     
    } catch(e){
      console.log(e);
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
     setShow(false);
     setDate(currentDate);
     let tempDate = new Date(currentDate);
     let newDate = new Date();
     if (newDate.getDate() == tempDate.getDate() && newDate.getMonth() == tempDate.getMonth() && tempDate.getFullYear() == newDate.getFullYear()){
        setTime('Today');
        getWater(moment(new Date()).format('DD/MM/YYYY'))
        getExercise(moment(new Date()).format('DD/MM/YYYY'))
        getBreakfast(moment(new Date()).format('DD/MM/YYYY'))
        getLunch(moment(new Date()).format('DD/MM/YYYY'))
        getDinner(moment(new Date()).format('DD/MM/YYYY'))
        getSnacks(moment(new Date()).format('DD/MM/YYYY'))
        getBaseGoal(new Date());
        
     }
    else {
      setTime(moment(new Date(currentDate)).format('DD/MM/YYYY'));
      getWater(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      getExercise(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      getBreakfast(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      getLunch(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      getDinner(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      getSnacks(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      getBaseGoal(new Date(currentDate));
    }
 }
 
  return (
    <ScrollView>
        <View style={styles.container}>
        {show && (
        <DateTimePicker
          value={date}
          mode={'date'}
          display='default'
          onChange={onChange}
        />
      )}
          <TouchableOpacity onPress={()=>setShow(true)}>
          <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
            <Image
                source={require("../assets/calendar.png")}
                resizeMode="contain"
                style={styles.tabIcon}
            />
            <Text style={[styles.text, {fontWeight: "bold", margin: 5}]}>{time}</Text>
          </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.container, { alignItems: "center", justifyContent: "center"}]}>
            <Text style={[styles.text, {color: '#444444'}]}>Remaining = Goal - Food + Exercire</Text>
            <View style={{flexDirection: 'row', alignItems: "center"}}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={viewExercise}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>{language === 'vn' ? 'Thể dục' : 'Excercise'}</Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}>{exercise}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={viewWater}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>{language === 'vn' ? 'Nước' : 'Water'}</Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}>{water}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={takeNote}>
                  <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>{language === 'vn' ? 'Ghi chú' : 'Note'}</Text>
                  <Image
                    source={require("../assets/paperclip.png")}
                    resizeMode="contain"
                    style={styles.tabIcon}
                  />
                  </TouchableOpacity>
                </View>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <Text style={[styles.text, {color: '#FFFFFF'}]}>{language === 'vn' ? 'Mục tiêu' : 'Base Goal'}</Text>
                  <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold", marginBottom: 10}]}>{baseGoal}</Text>
                  <ProgressCircle
                    percent={(parseInt(breakfast) + parseInt(snacks) + parseInt(lunch) + parseInt(dinner))/(parseInt(baseGoal)+parseInt(exercise)) * 100}
                    radius={70}
                    borderWidth={8}
                    color={(parseInt(baseGoal)+parseInt(exercise)-parseInt(breakfast)- parseInt(snacks)- parseInt(lunch)-parseInt(dinner) > 0)? '#12CE46' : '#E8142F'}
                    shadowColor="#FFFFFF" //phần trăm không chiếm
                    bgColor="#CFCFCF" //ở trong vòng tròn
                  >
                 <Text style={{ fontSize: 16,  color: '#FFFFFF', fontWeight: 'bold'}}>{parseInt(baseGoal)+parseInt(exercise)-parseInt(breakfast)- parseInt(snacks)- parseInt(lunch)-parseInt(dinner)}</Text>
                 <Text style={{ fontSize: 16, color: '#FFFFFF'}}>{isOver}</Text>
                 </ProgressCircle>
  
                  <TouchableOpacity style={[styles.text, {color: '#FFFFFF', marginTop: 5}]} onPress={viewAll}> 
                  <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold", margin: 5}]}>{language === 'vn' ? 'Xem tất cả' : 'View All'}</Text>
                   </TouchableOpacity>
                  
                </View>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={()=> viewMeal('Breakfast')}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>{language === 'vn' ? 'Bữa sáng' : 'Breakfast'}</Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}>{breakfast}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={()=> viewMeal('Lunch')}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>{language === 'vn' ? 'Bữa trưa' : 'Lunch'}</Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}>{lunch}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={()=> viewMeal('Dinner')}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>{language === 'vn' ? 'Bữa tối' : 'Dinner'}</Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}>{dinner}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={()=> viewMeal('Snacks')}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>{language === 'vn' ? 'Ăn vặt' : 'Snacks'}</Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}>{snacks}</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
          <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: "center"}}>
            <Image
                source={require("../assets/microscope.png")}
                resizeMode="contain"
                style={[styles.tabIcon, {marginLeft: 20, marginRight: 5}]}
            />
            <Text style={[styles.text, {fontWeight: "bold", color: '#FFFFFF', margin: 5}]}>{language === 'vn' ? 'Phân tích của tôi: ' : 'My analysis: '}</Text>
            {(() => {
              if (parseInt(baseGoal)+parseInt(exercise)-parseInt(breakfast)- parseInt(snacks) - parseInt(lunch)-parseInt(dinner) < 0){
                return <Text style={[styles.text, {color: '#FFFFFF'}]}>{language === 'vn' ? 'Vượt quá' : 'Exceeded'}</Text>
              }
              else{
                if (parseInt(baseGoal)+parseInt(exercise)-parseInt(breakfast)- parseInt(snacks)- parseInt(lunch)-parseInt(dinner) == 0){
                  return <Text style={[styles.text, {color: '#FFFFFF'}]}>{language === 'vn' ? 'Đủ: ' : 'Met'}</Text>
                }
                else{
                  return <Text style={[styles.text, {color: '#FFFFFF'}]}>{language === 'vn' ? 'Thiếu hụt' : 'Decifit'}</Text>
                }
              }
            })()}
          </View>
        </View>
    </ScrollView>
  );
};

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

export default HomeScreen;
