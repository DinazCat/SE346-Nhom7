import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import PopFoodAmount from "./PopFoodAmount";

const DetailExerciseScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const date = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time;
    const [exercise, setExercise] = useState(0);
    const [snacks, setSnacks] = useState(0);
    const [exerciseList, setExerciseList] = useState([]);

    useEffect(() => {
        
        getExercise(date)
    }, []);
    const Add = () => {
        navigation.navigate('AddItemScreen', {date: date, page:4})
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
      
      
 return (<View>
    <TouchableOpacity>
    <Text>Return</Text>
</TouchableOpacity>
<TouchableOpacity onPress={Add}>
    <Text>Add</Text>
    </TouchableOpacity>
    
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
export default DetailExerciseScreen;