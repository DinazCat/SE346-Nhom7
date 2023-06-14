import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import PopFoodAmount from "./PopFoodAmount";

const DetailWaterScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const date = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time;
    const [water, setWater] = useState(0);
    const [waterList, setWaterList] = useState([]);
    useEffect(() => {
        getWater(date)
    }, []);
    const Add = () => {
      navigation.navigate('AddItemScreen', {date: date, page:3})
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
      
 return (
 <View>
    <TouchableOpacity>
    <Text>Return</Text>
</TouchableOpacity>
<TouchableOpacity onPress={Add}>
    <Text>Add</Text>
    </TouchableOpacity>
    
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
export default DetailWaterScreen;