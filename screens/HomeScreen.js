import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ImageBackground} from "react-native";
import ProgressCircle from 'react-native-progress-circle'
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from "../navigation/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { setTime, setBaseGoal, setExercise } from "../store/CaloriesDiarySlice";
import { useDispatch } from "react-redux";
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import moment from 'moment';
const HomeScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const language = useContext(LanguageContext);
  const [bmi, setBmi] = useState('');
  const baseGoal = useSelector((state)=>state.CaloriesDiary.baseGoal);
  const [meal, setMeal] = useState(0);
  const exercise = useSelector((state)=>state.CaloriesDiary.exercise);
  const [water, setWater] = useState(0);
  const [breakfast, setBreakfast] = useState(0);
  const [lunch, setLunch] = useState(0);
  const [dinner, setDinner] = useState(0);
  const [snacks, setSnacks] = useState(0);
  //const remaining = parseInt(baseGoal)+parseInt(exercise)-parseInt(meal);
  //const [isOver, setIsOver] = useState('Remaining');
  const [show, setShow] = useState(false);
  const [evaluate, setEvaluate] = useState('');
  const dispatch = useDispatch();
  const time = useSelector((state)=>state.CaloriesDiary.time)
  const [date, setDate] = useState(time=='Today'? new Date(): new Date(moment(time, 'DD/MM/YYYY')));
  const theme = useContext(ThemeContext);
  //View All
  const viewAllMeal = () => {
    navigation.push("DetailHomeScreen", {time: time})
  }
  const takeNote = () => {
    navigation.navigate("TakeNoteScreen", {time: time})
  }
  const viewWater = () => {
    navigation.push('DetailWaterScreen', {time: time})
  }
  const viewExercise = () => {
    navigation.push('DetailExerciseScreen', {time: time})
  }
  const viewMeal = (mealType) => {
    navigation.push('DetailMealScreen', {time: time, mealType: mealType})
  }
  
  useEffect(() => {
    getBaseGoal(time=='Today'? new Date(): new Date(moment(time, 'DD/MM/YYYY')));
    getExercise(time=='Today'? moment(new Date()).format('DD/MM/YYYY'): time)
    getMeal(time=='Today'? moment(new Date()).format('DD/MM/YYYY'): time)
    getWater(time=='Today'? moment(new Date()).format('DD/MM/YYYY'): time)
    getBmi();
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
        dispatch(setExercise(totalExercise));
        
      })
      
    } catch(e){
      console.log(e);
    }
  }
  const getMeal = (date) => {
    try{
      firestore()
      .collection('foodsDiary')
      .where("userId", '==', user.uid)
      .where("time", '==', date)
      .onSnapshot((querySnapshot)=>{
        let totalBreakfast = 0;
        let totalLunch = 0;
        let totalDinner = 0;
        let totalSnacks = 0;
        let total = 0;
        querySnapshot.forEach(doc =>{
          const {calories, mealType} = doc.data();
          total += parseInt(calories);
          
          switch(mealType){
            case 'Breakfast':
              totalBreakfast += parseInt(calories);
              break;
            case 'Lunch':
              totalLunch += parseInt(calories);
              break;
            case 'Dinner':
              totalDinner += parseInt(calories);
              break;
            case 'Snacks':
              totalSnacks += parseInt(calories);
              break;
          }
        })
        setMeal(total);
        setBreakfast(totalBreakfast);
        setLunch(totalLunch);
        setDinner(totalDinner);
        setSnacks(totalSnacks);
    })
    } catch(e){
      console.log(e);
    }
  }
  const getBmi = () => {
    firestore()
      .collection('bmi')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          const bmi = (parseInt(data.weight * 10000) / (parseInt(data.height) * parseInt(data.height))).toFixed(1);
          setBmi(bmi);
          if(bmi < 18.5){
            setEvaluate(language=='vn'?'Bạn bị nhẹ cân': 'You are underweight')
          }
          else{
            if (bmi >= 18.5 && bmi <= 24.9){
              setEvaluate(language=='vn'?'Bạn bình thường': 'You are normal')
            }
            else {
              if (bmi >= 25 && bmi < 30){
                setEvaluate(language=='vn'?'Bạn bị thừa cân': 'You are overweight')
              }
              else{
                setEvaluate(language=='vn'?'Bạn bị béo phì': 'You are obese')
              }
            }
          }
        }
      });
  }
  //get base goal
  const getBaseGoal = (date) => {
    try{
      firestore()
      .collection('bmiDiary')
      .where('userId', '==', user.uid)
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
          dispatch(setBaseGoal(arrSort[0].bmr));
        }
        else{
          dispatch(setBaseGoal(arrTempSort[arrTempSort.length - 1].bmr));
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
        dispatch(setTime('Today'));
        getBaseGoal(new Date());
        getExercise(moment(new Date()).format('DD/MM/YYYY'))
        getMeal(moment(new Date()).format('DD/MM/YYYY'))
        getWater(moment(new Date()).format('DD/MM/YYYY'))
     }
    else {
      dispatch(setTime(moment(new Date(currentDate)).format('DD/MM/YYYY')));
      getBaseGoal(new Date(currentDate));
      getExercise(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      getMeal(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      getWater(moment(new Date(currentDate)).format('DD/MM/YYYY'))
      
    }
 }
 
  return (
    <View style={{backgroundColor: theme === 'light'? '#FFFFFF' : '#000000', flex: 1}}>
    <ImageBackground source={theme==='light'?require('../assets/bh_home.png'): require('../assets/bh_home_dark.jpg')} resizeMode="cover" style={{flex: 1}}>

      
        <View style={[styles.container, {backgroundColor: theme === 'light'? '#84D07D' : '#4E4E4E', borderColor: theme === 'light'? '#84D07D' : '#4E4E4E'}]}>
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
            <Text style={[styles.text, {fontWeight: "bold", margin: 5}]}>{(time=='Today'&& language==='vn')?'Hôm nay': time}</Text>
          </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.container, { alignItems: "center", justifyContent: "center", backgroundColor: theme === 'light'? '#84D07D' : '#4E4E4E', borderColor: theme === 'light'? '#84D07D' : '#4E4E4E'}]}>
            <Text style={[styles.text, {color: '#FFFFFF'}]}>{language === 'vn' ? 'Còn lại = Mục tiêu - Thức ăn + Thể dục' : 'Remaining = Goal - Food + Exercire'}</Text>
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
                    percent={(parseInt(meal))/(parseInt(baseGoal)+parseInt(exercise)) * 100}
                    radius={70}
                    borderWidth={8}
                    color={(parseInt(baseGoal) + parseInt(exercise) - parseInt(meal) >= 0)? '#14A844' : '#E8142F'}
                    shadowColor="#FFFFFF" //phần trăm không chiếm
                    bgColor={theme === 'light'? '#84D07D' : '#4E4E4E'} //ở trong vòng tròn
                  >
                 <Text style={{ fontSize: 16,  color: '#FFFFFF', fontWeight: 'bold'}}>{Math.abs(parseInt(baseGoal)+parseInt(exercise)-parseInt(meal))}</Text>
                 <Text style={{ fontSize: 16, color: '#FFFFFF'}}>{(parseInt(baseGoal) + parseInt(exercise) - parseInt(meal) >= 0)?(language==='vn'?'Còn lại':'Remaining'):(language==='vn'?'Quá':'Over')}</Text>
                 </ProgressCircle>
  
                  <TouchableOpacity style={[styles.text, {color: '#FFFFFF', marginTop: 5}]} onPress={viewAllMeal}> 
                  <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold", margin: 5}]}>{language === 'vn' ? 'Xem tất cả bữa ăn' : 'View all meal'}</Text>
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
          <View style={[styles.container, {backgroundColor: theme === 'light'? '#84D07D' : '#4E4E4E', borderColor: theme === 'light'? '#84D07D' : '#4E4E4E'}]}>
          <View style={{flexDirection: 'row', alignItems: "center"}}>
            <Image
                source={require("../assets/microscope.png")}
                resizeMode="contain"
                style={[styles.tabIcon, {marginLeft: 20, marginRight: 5}]}
            />
            <Text style={[styles.text, {fontWeight: "bold", color: '#FFFFFF', margin: 5}]}>{language === 'vn' ? 'Phân tích của tôi: ' : 'My analysis: '}</Text>
            {(() => {
              if (parseInt(baseGoal)+parseInt(exercise)-parseInt(meal) < 0){
                return <Text style={[styles.text, {color: '#FFFFFF'}]}>{language === 'vn' ? 'Vượt quá' : 'Exceeded'}</Text>
              }
              else{
                if (parseInt(baseGoal)+parseInt(exercise)-parseInt(meal) == 0){
                  return <Text style={[styles.text, {color: '#FFFFFF'}]}>{language === 'vn' ? 'Đủ' : 'Met'}</Text>
                }
                else{
                  return <Text style={[styles.text, {color: '#FFFFFF'}]}>{language === 'vn' ? 'Thiếu hụt' : 'Decifit'}</Text>
                }
              }
            })()}
          </View>
        </View>
       
    <View style={{marginTop: 95, marginLeft: 75}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontWeight: 'bold', fontSize: 25, color: theme==='light'?'#37C142':'#050505'}}>{language==='vn'?'BMI index: ':'Chỉ số Bmi: '}</Text>
        <Text style={{fontSize: 25, color: theme==='light'?'#58D77F':'#050505'}}>{bmi}</Text>
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 25, color: theme==='light'?'#37C142':'#050505'}}>{evaluate}</Text>
    </View>
    </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1, 
    borderRadius: 5, 
    margin: 5,
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },

  tabIcon: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
