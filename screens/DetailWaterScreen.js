import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert, ScrollView} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext, useRef} from "react";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import CheckBox from "@react-native-community/checkbox";

const DetailWaterScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const row = [];
    let prevOpenedRow;
    const date = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time;
    const [water, setWater] = useState(0);
    const [waterList, setWaterList] = useState([]);
    const language = useContext(LanguageContext);
    const theme = useContext(ThemeContext)
    useEffect(() => {
        getWater(date)
    }, []);
    const back = () => {
      navigation.goBack();
    }
    const Add = () => {
      navigation.navigate('AddItemScreen', {date: date, page:3})
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
                amount: amount,
                isCheck: 'false'
              });
            })
            setWaterList(list);
            setWater(totalWater);
          })
         
        } catch(e){
          console.log(e);
        }
      }
  
  const rightSwipe = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity>
          <Text style={{color: theme==='light'?"#000":"#fff"}}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{color: theme==='light'?"#000":"#fff"}}>Select</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const closeRow = (index) => {
    if(prevOpenedRow && prevOpenedRow !== row[index]){
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
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
    <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?"Nước":"Water"}</Text>
    <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(water > 0)? water+" ml": ''}</Text>
  </View>
  
    <ScrollView>
    {waterList?.map((item, index)=>{
                    return(  
<GestureHandlerRootView key={index}>
                          <Swipeable 
                          ref={ref => row[index] = ref}
                          renderRightActions={()=>{return(
                            <View style={{flexDirection: 'row'}}>
                              <TouchableOpacity style={{backgroundColor: '#D436F0', justifyContent: 'space-around'}}>
        <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Tất cả":"All"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'space-around'}} onPress={()=>{
          row[index].close();
          deleteWater(item)
          }}>
          <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Xóa":"Delete"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: '#E3912C', justifyContent: 'space-around'}} >
          <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Chọn":"Select"}</Text>
        </TouchableOpacity>
      </View>
                    )}}  onSwipeableWillOpen={()=> closeRow(index)}
                    >
                            
                          <View style={{alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3, paddingBottom: 5, backgroundColor: '#CCC', borderBottomColor: '#fff', borderBottomWidth: 2}}>

                          <Image source={require( '../assets/water_.png')} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                             <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} ml</Text>
                      
                      </View>
                      {(item.isCheck==true)?<CheckBox/>:null}
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
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backAll: {
    backgroundColor: 'red',
    right:150,
  },
  backSelect: {
  backgroundColor: '#D436F0',
  right: 75,
  },
  backDelete:{
  backgroundColor: '#E3912C',
  right: 0,
  },
  rowFront: {
  backgroundColor: '#CCC',
  justifyContent: 'center',
  flex: 1
  },
  });
export default DetailWaterScreen;