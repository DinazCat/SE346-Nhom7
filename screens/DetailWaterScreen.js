import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from "react";
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import PopFoodAmount from "./PopFoodAmount";
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import { SwipeListView } from "react-native-swipe-list-view";

const DetailWaterScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
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
    
    const deleteWater = (selectedItem, rowMap) => {
      let index = waterList.findIndex(item=>item.id === selectedItem.id)
      rowMap[`${index}`].closeRow();
        Alert.alert('Delete', 'Do you want to remove ingredient?', [
              {
                text: 'Cancel',
                
                style: 'cancel',
              },
              {text: 'OK', onPress: () => {
                firestore().collection('water').doc(selectedItem.id).delete().then(() => {});
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
            setWaterList(list);
            setWater(totalWater);
          })
         
        } catch(e){
          console.log(e);
        }
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
  <SwipeListView  
    useFlatList={true}
                 data={waterList}
                 renderItem={({item}) => (
                   <View style={styles.rowFront}> 
                   <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 15, marginVertical: 3, paddingBottom: 5}}>
                      <Image source={require( '../assets/water_.png')} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} ml</Text>
                      </View>
                  </View>
                   </View>
                 
                 )}
                 //
                 renderHiddenItem={ ({item}, rowMap) => (
                   <View style={styles.rowBack}>
               <TouchableOpacity 
                   style={[styles.backRightBtn, styles.backAll]}
               >
                   <Text style={styles.backTextWhite}>{language === 'vn' ? 'Tất cả' : 'All'}</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                   style={[styles.backRightBtn,styles.backSelect]}
               >
                   <Text style={styles.backTextWhite}>{language === 'vn' ? 'Chọn' : 'Select'}</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>deleteWater(item, rowMap)}
                   style={[styles.backRightBtn,styles.backDelete]}
               >
                   <Text style={styles.backTextWhite}>{language === 'vn' ? 'Xóa' : 'Delete'}</Text>
               </TouchableOpacity>
               
           </View>
               )}
               keyExtractor={(item, index)=>index.toString()}
                 disableRightSwipe
                   rightOpenValue={-225}//lấy 75 nhân vs số button cần làm
                   //previewRowKey={'0'}
                   previewOpenValue={-40}
                   previewOpenDelay={3000}
                   ItemSeparatorComponent={()=> (
                    <View
        style={{
          height: 2,
          backgroundColor: "#fff",
        }}
      />
                   )}
                  recalculateHiddenLayout={true} //{nội dung để tick chọn xóa thì đẩy flex ở add screen lên là đc}
                />
    
    

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