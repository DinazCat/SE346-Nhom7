import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import PopFoodAmount from "./PopFoodAmount";
import ThemeContext from "../context/ThemeContext";
import LanguageContext from "../context/LanguageContext";
import { GestureHandlerRootView, Swipeable, ScrollView } from "react-native-gesture-handler";

const DetailHomeScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const date = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time;
    const [exercise, setExercise] = useState(0);
    const [water, setWater] = useState(0);
    const [breakfast, setBreakfast] = useState(0);
    const [lunch, setLunch] = useState(0);
    const [dinner, setDinner] = useState(0);
    const [snacks, setSnacks] = useState(0);
    const [exerciseList, setExerciseList] = useState([]);
    const [waterList, setWaterList] = useState([]);
    const [breakfastList, setBreakfastList] = useState([]);
    const [lunchList, setLunchList] = useState([]);
    const [dinnerList, setDinnerList] = useState([]);
    const [snacksList, setSnacksList] = useState([]);
    const theme = useContext(ThemeContext)
    const language= useContext(LanguageContext)
    const row = [];
    let prevOpenedRow;

    useEffect(() => {
        getBreakfast(date)
        getLunch(date)
        getDinner(date)
        getSnacks(date)
        getExercise(date)
        getWater(date)
    }, []);
    const back = () => {
      navigation.goBack();
    }
    const Add = () => {
      navigation.navigate('AddScreen', {date: date})
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
    const getWater = (date)=> {
        try{
          firestore()
          .collection('water')
          .where("userId", '==', user.uid)
          .where("time", '==', date)
          .onSnapshot((querySnapshot)=>{
            let totalWater = 0;
            let list= [];
            querySnapshot.forEach(doc =>{
              const {amount} = doc.data();
              totalWater += parseInt(amount);
              list.push({          
                id: doc.id,
                amount: amount
              });
            })
            setWater(totalWater);
            setWaterList(list);
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
            let list= [];
            querySnapshot.forEach(doc =>{
              const {calories, image, name, amount} = doc.data();
              totalExercise += parseInt(calories);
              list.push({          
                id: doc.id,
                amount: amount,
                calories: calories,
                image: image,
                name: name,
                amount: amount
              });

            })
            setExercise(totalExercise);
            setExerciseList(list);
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
            let list= [];
            querySnapshot.forEach(doc =>{
              const {calories, image, name, amount, unit} = doc.data();
              totalBreakfast += parseInt(calories);
              list.push({          
                id: doc.id,
                amount: amount,
                calories: calories,
                image: image,
                name: name,
                amount: amount,
                unit: unit
              });
            })
            setBreakfast(totalBreakfast);
            setBreakfastList(list);
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
            let list= [];
            querySnapshot.forEach(doc =>{
              const {calories, image, name, amount, unit} = doc.data();
              totalLunch += parseInt(calories);
              list.push({          
                id: doc.id,
                amount: amount,
                calories: calories,
                image: image,
                name: name,
                amount: amount,
                unit: unit
              });
            })
            setLunch(totalLunch);
            setLunchList(list);
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
            let list= [];
            querySnapshot.forEach(doc =>{
              const {calories, image, name, amount, unit} = doc.data();
              totalDinner += parseInt(calories);
              list.push({          
                id: doc.id,
                amount: amount,
                calories: calories,
                image: image,
                name: name,
                amount: amount,
                unit: unit
              });
            })
            setDinner(totalDinner);
            setDinnerList(list);
            
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
            let list= [];
            querySnapshot.forEach(doc =>{
              const {calories, image, name, amount, unit} = doc.data();
              totalSnacks += parseInt(calories);
              list.push({          
                id: doc.id,
                amount: amount,
                calories: calories,
                image: image,
                name: name,
                amount: amount,
                unit: unit
              });
            })
            setSnacks(totalSnacks);
            setSnacksList(list);
            
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
  <View style={{flexDirection: 'row', marginHorizontal: 15, marginBottom: 7}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Tổng calories tiêu thụ':'Total calories burned'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(breakfast +  lunch + dinner + snacks> 0)? breakfast +  lunch + dinner + snacks+" cals": ''}</Text>
    </View>
    <ScrollView>
    <View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 3, marginBottom: 10}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Buổi sáng':'Breakfast'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(breakfast> 0)? breakfast+" cals": ''}</Text>
    </View>
    {breakfastList?.map((item, index)=>{
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
    {lunchList?.map((item, index)=>{
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
    {dinnerList?.map((item, index)=>{
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
    {snacksList?.map((item, index)=>{
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
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Thể dục':'Exercise'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(exercise> 0)? exercise+" cals": ''}</Text>
    </View>
    {exerciseList?.map((item, index)=>{
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
      deleteWater(item)
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
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} {language==='vn'?"phút":"Exercise"}</Text>
                      </View>
                  </View>
                  
                  </Swipeable>
                  </GestureHandlerRootView>
                      )}
                     )}
<View style={{flexDirection: 'row', marginHorizontal: 15, marginTop: 7, marginBottom: 10}}>
      <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Nước':'Water'}</Text>
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(water> 0)? water+ ' ml': ''}</Text>
    </View>
    {waterList?.map((item, index)=>{
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
                                  deleteWater(item)
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
                        
                                                  <Image source={require( '../assets/water_.png')} style={{width: 40,
                                height: 40,
                                resizeMode: 'stretch'}}/>
                                                     <View style={{marginLeft:'auto'}}>
                                              <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} ml</Text>
                                              
                                              </View>
                                             
                                              </View>
                                              
                                              </Swipeable>
                                              </GestureHandlerRootView>
                      )}
                     )}
    
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