import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import PopFoodAmount from "./PopFoodAmount";

const DetailMealScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const date = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time;
    const mealType = route.params?.mealType;
    const [meal, setMeal] = useState(0);
    const [mealList, setMealList] = useState([]);

    useEffect(() => {
        getMealType(date)
    }, []);
    const Add = () => {
      navigation.navigate('AddFoodScreen', {date: date, mealType: mealType})
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
       
      const getMealType = (date)=> {
        try{
          firestore()
          .collection('foodsDiary')
          .where("userId", '==', user.uid)
          .where("time", '==', date)
          .where("mealType", '==', mealType)
          .onSnapshot((querySnapshot)=>{
            let total = 0;
            let list= [];
            querySnapshot.forEach(doc =>{
              const {calories, image, name, amount, unit} = doc.data();
              total += parseInt(calories);
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
            setMeal(total);
            setMealList(list);
            
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
    <Text>{mealType} {meal}</Text>
    
    
    {mealList?.map((item, index)=>{
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
export default DetailMealScreen;