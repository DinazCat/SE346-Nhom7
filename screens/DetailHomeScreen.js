import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import * as Progress from 'react-native-progress';
import { AuthContext } from '../navigation/AuthProvider';
import ThemeContext from "../context/ThemeContext";
import LanguageContext from "../context/LanguageContext";
import { GestureHandlerRootView, Swipeable, ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
const DetailHomeScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const date = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time;
    const [breakfast, setBreakfast] = useState(0);
    const [lunch, setLunch] = useState(0);
    const [dinner, setDinner] = useState(0);
    const [snacks, setSnacks] = useState(0);
    const [mealList, setMealList] = useState([]);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const baseGoal = useSelector((state)=>state.CaloriesDiary.baseGoal);
    const exercise = useSelector((state)=>state.CaloriesDiary.exercise);
    const caloriesBudget = parseInt(baseGoal) + parseInt(exercise);
    const theme = useContext(ThemeContext)
    const language= useContext(LanguageContext)
    const row = [];
    let prevOpenedRow;

    useEffect(() => {
        getMeal(date);
    }, []);
    const back = () => {
      navigation.goBack();
    }
    const Add = () => {
      navigation.navigate('AddFoodScreen', {date: date})
    }
    const deleteFoodsDiary = (item) => {
        Alert.alert('Delete', 'Do you want to remove ingredient?', [
              {
                text: 'Cancel',
                
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
                firestore().collection('foodsDiary').doc(item.id).delete().then(() => {});
              }},
        ]);
    }
    const deleteWater = (item) => {
        Alert.alert('Delete', 'Do you want to remove water?', [
              {
                text: 'Cancel',
                
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
                firestore().collection('water').doc(item.id).delete().then(() => {});
              }},
        ]);
    }
    const deleteExercise = (item) => {
        Alert.alert('Delete', 'Do you want to remove exercise?', [
              {
                text: 'Cancel',
                
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
                firestore().collection('exercise').doc(item.id).delete().then(() => {});
              }},
        ]);
    }
    
      const getMeal = (date)=> {
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
            let list= [];
            let sumCarbs = 0;
            let sumFat = 0;
            let sumProtein = 0;
            querySnapshot.forEach(doc =>{
              const {calories, image, name, amount, unit, mealType, carbs, fat, protein} = doc.data();
              sumCarbs += parseInt(carbs);
              sumFat += parseInt(fat);
              sumProtein += parseInt(protein);
              list.push({          
                id: doc.id,
                amount: amount,
                calories: calories,
                image: image,
                name: name,
                amount: amount,
                unit: unit,
                mealType: mealType
              });
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
            setBreakfast(totalBreakfast);
            setLunch(totalLunch);
            setDinner(totalDinner);
            setSnacks(totalSnacks);
            setMealList(list);
            setTotalCarbs(sumCarbs);
            setTotalFat(sumFat);
            setTotalProtein(sumProtein);
        })
        } catch(e){
          console.log(e);
        }
      }
      
      const closeRow = (index, item) => {
        if(prevOpenedRow && prevOpenedRow !== row[item.id]){
          prevOpenedRow.close();
        }
        prevOpenedRow = row[item.id];
      }
      
 return (
  <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
  <TouchableOpacity style={{marginLeft: 15, marginVertical: 5}} onPress={back}>
    <Icon name={'arrow-left'} size={25} color={theme==='light'?"#000":"#fff"}/>
  </TouchableOpacity>
<TouchableOpacity style={{marginLeft:'auto', marginHorizontal: 15, marginBottom: 7}} onPress={Add}>
  <Icon name={'plus-circle'} size={30} color={'#0AD946'}/>
  </TouchableOpacity>
    <ScrollView>
    <View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 3, marginBottom: 10}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Buổi sáng':'Breakfast'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(breakfast> 0)? breakfast+" cals": ''}</Text>
    </View>
    {mealList.filter(item=>item.mealType=='Breakfast')?.map((item, index)=>{
                    return(  
                      <GestureHandlerRootView key={index}>
                      <Swipeable 
                      ref={ref => row[item.id] = ref}
                      renderRightActions={()=>{return(
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={{backgroundColor: '#D436F0', justifyContent: 'space-around'}}>
    <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Tất cả":"All"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'space-around'}} onPress={()=>{
      row[item.id].close();
      deleteFoodsDiary(item)
      }}>
      <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Xóa":"Delete"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor: '#E3912C', justifyContent: 'space-around'}} >
      <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Chọn":"Select"}</Text>
    </TouchableOpacity>
  </View>
                )}}  onSwipeableWillOpen={()=> closeRow(index, item)}
                >
                        
                        <View style={{alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3, paddingBottom: 5, backgroundColor: '#CCC', borderBottomColor: '#fff', borderBottomWidth: 2}}>
                      <Image source = {{uri: item.image}} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <Text style={{fontSize: 18, width: 200, marginStart: 3}}>{item.name}</Text>
                      <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.calories} cals</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} {item.unit}</Text>
                      </View>
                  </View>
                  
                  </Swipeable>
                  </GestureHandlerRootView>
                      )}
                     )}

<View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 7, marginBottom: 10}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Buổi trưa':'Lunch'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(lunch> 0)? lunch+" cals": ''}</Text>
    </View>
    {mealList.filter(item=>item.mealType=='Lunch')?.map((item, index)=>{
                    return(  
                      <GestureHandlerRootView key={index}>
                      <Swipeable 
                      ref={ref => row[item.id] = ref}
                      renderRightActions={()=>{return(
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={{backgroundColor: '#D436F0', justifyContent: 'space-around'}}>
    <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Tất cả":"All"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'space-around'}} onPress={()=>{
      row[item.id].close();
      deleteFoodsDiary(item)
      }}>
      <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Xóa":"Delete"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor: '#E3912C', justifyContent: 'space-around'}} >
      <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Chọn":"Select"}</Text>
    </TouchableOpacity>
  </View>
                )}}  onSwipeableWillOpen={()=> closeRow(index, item)}
                >
                        
                        <View style={{alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3, paddingBottom: 5, backgroundColor: '#CCC', borderBottomColor: '#fff', borderBottomWidth: 2}}>
                      <Image source = {{uri: item.image}} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <Text style={{fontSize: 18, width: 200, marginStart: 3}}>{item.name}</Text>
                      <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.calories} cals</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} {item.unit}</Text>
                      </View>
                  </View>
                  
                  </Swipeable>
                  </GestureHandlerRootView>
                      )}
                     )}
<View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 7, marginBottom: 10}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Buổi tối':'Dinner'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(dinner> 0)? dinner+" cals": ''}</Text>
    </View>
    {mealList.filter(item=>item.mealType=='Dinner')?.map((item, index)=>{
                    return(  
                      <GestureHandlerRootView key={index}>
                      <Swipeable 
                      ref={ref => row[item.id] = ref}
                      renderRightActions={()=>{return(
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={{backgroundColor: '#D436F0', justifyContent: 'space-around'}}>
    <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Tất cả":"All"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'space-around'}} onPress={()=>{
      row[item.id].close();
      deleteFoodsDiary(item)
      }}>
      <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Xóa":"Delete"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor: '#E3912C', justifyContent: 'space-around'}} >
      <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Chọn":"Select"}</Text>
    </TouchableOpacity>
  </View>
                )}}  onSwipeableWillOpen={()=> closeRow(index, item)}
                >
                        
                        <View style={{alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3, paddingBottom: 5, backgroundColor: '#CCC', borderBottomColor: '#fff', borderBottomWidth: 2}}>
                      <Image source = {{uri: item.image}} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <Text style={{fontSize: 18, width: 200, marginStart: 3}}>{item.name}</Text>
                      <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.calories} cals</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} {item.unit}</Text>
                      </View>
                  </View>
                  
                  </Swipeable>
                  </GestureHandlerRootView>
                      )}
                     )}
    <View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 7, marginBottom: 10}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Ăn vặt':'Snacks'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(snacks> 0)? snacks+" cals": ''}</Text>
    </View>
    {mealList.filter(item=>item.mealType=='Snacks')?.map((item, index)=>{
                    return(  
                      <GestureHandlerRootView key={index}>
                      <Swipeable 
                      ref={ref => row[item.id] = ref}
                      renderRightActions={()=>{return(
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={{backgroundColor: '#D436F0', justifyContent: 'space-around'}}>
    <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Tất cả":"All"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'space-around'}} onPress={()=>{
      row[item.id].close();
      deleteFoodsDiary(item)
      }}>
      <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Xóa":"Delete"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor: '#E3912C', justifyContent: 'space-around'}} >
      <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Chọn":"Select"}</Text>
    </TouchableOpacity>
  </View>
                )}}  onSwipeableWillOpen={()=> closeRow(index, item)}
                >
                        
                        <View style={{alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3, paddingBottom: 5, backgroundColor: '#CCC', borderBottomColor: '#fff', borderBottomWidth: 2}}>
                      <Image source = {{uri: item.image}} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <Text style={{fontSize: 18, width: 200, marginStart: 3}}>{item.name}</Text>
                      <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.calories} cals</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} {item.unit}</Text>
                      </View>
                  </View>
                  
                  </Swipeable>
                  </GestureHandlerRootView>
                      )}
                     )}
     <View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 7}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Tổng calories tiêu thụ':'Total calories burned'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(breakfast +  lunch + dinner + snacks> 0)? breakfast +  lunch + dinner + snacks +" cals": ''}</Text>
    </View>
    <View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 7}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Calories cần tiêu thụ':'Calories budget'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{caloriesBudget} cals</Text>
    </View>
    <View style={{marginHorizontal: 15, marginTop: 7}}>
    <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Hàm lượng dinh dưỡng trong ngày':'Day macros'}</Text>
    <View style={{marginVertical:3}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#5ADFC8', marginRight: 5}}>Carbs</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{totalCarbs}g, {(parseInt(totalCarbs)*40000/(caloriesBudget*45)).toFixed()}% {language=='vn'?'của ':'of '}{(caloriesBudget*45/400).toFixed()}g</Text>
        </View>
        <Progress.Bar progress={parseInt(totalCarbs)*400/(caloriesBudget*45)} width={380} color="#5ADFC8"/>
        </View>
        <View style={{marginVertical:3}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#CE65E0', marginRight: 5}}>{language==='vn'?'Chất đạm':'Protein'}</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{totalProtein}g, {(parseInt(totalProtein)*2000/(caloriesBudget)).toFixed()}% {language=='vn'?'của ':'of '}{(caloriesBudget/20).toFixed()}g</Text>
        </View>
        <Progress.Bar progress={parseInt(totalProtein)*20/(caloriesBudget)} width={380} color="#CE65E0"/>
        </View>
        <View style={{marginTop: 3, marginBottom: 10}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#E8B51A', marginRight: 5}}>{language==='vn'?'Chất béo':'Fat'}</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{totalFat}g, {(parseInt(totalFat)*90000/(caloriesBudget*35)).toFixed()}% {language=='vn'?'của ':'of '}{(caloriesBudget*35/900).toFixed()}g</Text>
        </View>
        <Progress.Bar progress={parseInt(totalFat)*900/(caloriesBudget*35)} width={380} color="#E8B51A"/>
        </View>
        </View>
</ScrollView>
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
export default DetailHomeScreen;