import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import PopFoodAmount from "./PopFoodAmount";

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

    useEffect(() => {
        getWater(date)
        getExercise(date)
        getBreakfast(date)
        getLunch(date)
        getDinner(date)
        getSnacks(date)
    }, []);
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
        Alert.alert('Delete', 'Do you want to remove ingredient?', [
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
        Alert.alert('Delete', 'Do you want to remove ingredient?', [
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
      
 return (<View>
    <TouchableOpacity>
    <Text>Return</Text>
</TouchableOpacity>
<TouchableOpacity onPress={Add}>
    <Text>Add</Text>
    </TouchableOpacity>
    <Text>Breakfast {breakfast}</Text>
    
    {breakfastList?.map((item, index)=>{
                    return(  
                        <View key={index}>

                          <TouchableOpacity onPress={()=>deleteFoodsDiary(item)}>
                            <Image source={{uri: item.image}} style={styles.tabIcon}/>
                            <Text>{item.name}</Text>
                            <Text>{item.amount} {item.unit}</Text>
                            <Text>{item.calories}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                     )}

    <Text>Lunch {lunch}</Text>
    {lunchList?.map((item, index)=>{
                    return(  
                        <View key={index}>

                          <TouchableOpacity onPress={()=>deleteFoodsDiary(item)}>
                            <Image source={{uri: item.image}} style={styles.tabIcon}/>
                            <Text>{item.name}</Text>
                            <Text>{item.amount} {item.unit}</Text>
                            <Text>{item.calories}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                     )}

    <Text>Dinner {dinner}</Text>
    {dinnerList?.map((item, index)=>{
                    return(  
                        <View key={index}>

                          <TouchableOpacity onPress={()=>deleteFoodsDiary(item)}>
                            <Image source={{uri: item.image}} style={styles.tabIcon}/>
                            <Text>{item.name}</Text>
                            <Text>{item.amount} {item.unit}</Text>
                            <Text>{item.calories}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                     )}
    <Text>Snacks {snacks}</Text>
    {snacksList?.map((item, index)=>{
                    return(  
                        <View key={index}>

                          <TouchableOpacity onPress={()=>deleteFoodsDiary(item)}>
                            <Image source={{uri: item.image}} style={styles.tabIcon}/>
                            <Text>{item.name}</Text>
                            <Text>{item.amount} {item.unit}</Text>
                            <Text>{item.calories}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                     )}
    <Text>Water {water}</Text>
    {waterList?.map((item, index)=>{
                    return(  
                        <View key={index}>

                          <TouchableOpacity onPress={()=>deleteWater(item)}>
                            <Image source={require( '../assets/water_.png')} style={styles.tabIcon}/>
                            <Text>{item.amount} ml</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                     )}
    <Text>Exercise {exercise}</Text>
    {exerciseList?.map((item, index)=>{
                    return(  
                        <View key={index}>

                          <TouchableOpacity onPress={()=>deleteExercise(item)}>
                            <Image source={{uri: item.image}} style={styles.tabIcon}/>
                            <Text>{item.name}</Text>
                            <Text>{item.amount} min</Text>
                            <Text>{item.calories}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                     )}

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