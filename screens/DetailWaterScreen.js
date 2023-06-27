import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert, ScrollView} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext, useRef} from "react";
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../navigation/AuthProvider';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import CheckBox from "@react-native-community/checkbox";
import PopFoodAmount from "./PopFoodAmount";
const DetailWaterScreen = ({route, navigation}) => {
    const [isOpen, setOpen] = useState(false);
    const [isAll, setIsAll] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [show, setShow] = useState(false);
    const {user} = useContext(AuthContext);
    const row = [];
    let prevOpenedRow;
    const [time, setTime] = useState((route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time);
    const tempTime = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time
    const [date, setDate] = useState(route.params?.time == 'Today'? new Date(): new Date(moment(route.params?.time, 'DD/MM/YYYY')));
    const [water, setWater] = useState(0);
    const [waterList, setWaterList] = useState([]);
    const language = useContext(LanguageContext);
    const theme = useContext(ThemeContext)
    useEffect(() => {
        getWater(tempTime)
    }, []);
    const back = () => {
      navigation.navigate('HomeScreen')
      none();
    }
    const Add = () => {
      navigation.navigate('AddItemScreen', {date: tempTime, page:3})
      none();
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
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
       setShow(false);
       setDate(currentDate);
       setTime(moment(new Date(currentDate)).format('DD/MM/YYYY'));
        
      
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
            let checkList = [];
            querySnapshot.forEach(doc =>{
              const {amount, isChecked} = doc.data();
              if (!isChecked) checkList.push(isChecked);
              totalWater += parseInt(amount);
              list.push({          
                id: doc.id,
                amount: amount,
                isChecked: isChecked
              });
            })
            setWaterList(list);
            setWater(totalWater);
            if(checkList.length > 0) setIsAll(true);
              else setIsAll(false);
          })
         
        } catch(e){
          console.log(e);
        }
      }
  
  const edit = (item) => {
    navigation.navigate("EditWater", {item:item})
  }
  const all = async(index) => {
    if(index >= 0) row[index].close();
    setOpen(true);
    //setIsAll(false)
    const usersQuerySnapshot = await firestore().collection('water')
    .where("userId", '==', user.uid)
    .where("time", '==', tempTime).get();
    const batch = firestore().batch();
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.update(documentSnapshot.ref, {"isChecked": true});
    });
    return batch.commit();
  }
  const deleteSelectedItems = async() => {
    const usersQuerySnapshot = await firestore().collection('water')
    .where("userId", '==', user.uid)
    .where("time", '==', tempTime)
    .where("isChecked", '==', true).get();
    const batch = firestore().batch();
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.delete(documentSnapshot.ref);
    });

    return batch.commit();
  }
  const none = async() => {
    //setIsAll(false);
    const usersQuerySnapshot = await firestore().collection('water')
    .where("userId", '==', user.uid)
    .where("time", '==', tempTime).get();
    const batch = firestore().batch();
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.update(documentSnapshot.ref, {"isChecked": false});
    });

    return batch.commit();
    
  }
  const close = ()=> {
    setOpen(false);
    none();
  }
  const select = (item, index) => {
    row[index].close();
    firestore().collection('water').doc(item.id).update({
      isChecked : true
    })
    setOpen(true);
  }
  const move = () => {
    setIsUpdate(true);
    setDate((route.params?.time == 'Today'? new Date(): new Date(moment(route.params?.time, 'DD/MM/YYYY'))))
    setTime((route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time)
    setVisible(true);
  }
  const finishMove = async() => {
    setVisible(false);
    const usersQuerySnapshot = await firestore().collection('water')
    .where("userId", '==', user.uid)
    .where("time", '==', tempTime)
    .where("isChecked", '==', true).get();
    const batch = firestore().batch();
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.update(documentSnapshot.ref, {"isChecked": false, "time": time});
    });

    return batch.commit();
  }
  const copy = () => {
    setIsUpdate(false);
    setDate((route.params?.time == 'Today'? new Date(): new Date(moment(route.params?.time, 'DD/MM/YYYY'))))
    setTime((route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time)
    setVisible(true);
  }
  const finishCopy = async() => {
    setVisible(false);
    const usersQuerySnapshot = await firestore().collection('water')
    .where("userId", '==', user.uid)
    .where("time", '==', tempTime)
    .where("isChecked", '==', true).get();
    const batch = firestore().batch();
    usersQuerySnapshot.forEach(documentSnapshot => {
      const data = documentSnapshot.data();
      const waterRef = firestore().collection('water')
      const id = waterRef.doc().id
      batch.set(waterRef.doc(id), {
        userId: user.uid,
        time: time,
        amount: data.amount,
        isChecked: false
      })
    });

    return batch.commit();
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
                          renderRightActions={()=>{
                            if(isOpen){
                              return <View></View>
                            }
                            return(
                              
                            <View style={{flexDirection: 'row'}}>
                              <TouchableOpacity style={{backgroundColor: '#D436F0', justifyContent: 'space-around'}} onPress={()=>all(index)}>
        <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Tất cả":"All"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'space-around'}} onPress={()=>{
          row[index].close();
          deleteWater(item)
          }}>
          <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Xóa":"Delete"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: '#E3912C', justifyContent: 'space-around'}} onPress={()=>select(item, index)}>
          <Text style={{color: "#000", width: 70, textAlign: 'center'}}>{language==='vn'?"Chọn":"Select"}</Text>
        </TouchableOpacity>
      </View>
                    )}}  onSwipeableWillOpen={()=> closeRow(index)}
                    >
                            <TouchableOpacity onPress={()=>edit(item)} delayPressIn={300}>
                          <View style={{alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 3, paddingBottom: 5, backgroundColor: '#CCC', borderBottomColor: '#fff', borderBottomWidth: 2}}>
                          
                          <Image source={require( '../assets/water_.png')} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                             <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} ml</Text>
                      
                      </View>
                      {isOpen?<CheckBox
                      value={item.isChecked}
                      onValueChange={(value)=>{
                          firestore().collection('water').doc(item.id).update({
                            isChecked : value
                          })
                          
                        }
                      }
                      />:null}
                      
                      </View>
                      </TouchableOpacity>
                      </Swipeable>
                      </GestureHandlerRootView>
                      )}
                     )}


</ScrollView>
{isOpen?<View style={{backgroundColor: theme === 'light'? '#EAEAEA' : '#838383', flexDirection: 'row', justifyContent: 'center', padding: 10}}>
{isAll?<TouchableOpacity onPress={all}>
  <View style={{alignItems: 'center', width: 80}}>
  <Image
    source={{uri: 'https://static-00.iconduck.com/assets.00/select-all-icon-512x512-h7e41rpz.png'}}
    style={{height: 25, width: 25}}
  />
    <Text style={styles.text}>{language==='vn'?'Tất cả': 'All'}</Text>
  </View>
</TouchableOpacity>:
<TouchableOpacity onPress={none}>
<View style={{alignItems: 'center', width: 80}}> 
  <Image
    source={{uri: 'https://static-00.iconduck.com/assets.00/select-all-icon-512x512-h7e41rpz.png'}}
    style={{height: 25, width: 25}}
  />
  <Text style={styles.text}>{language==='vn'?'Bỏ chọn tất cả': 'None'}</Text>
  </View>
</TouchableOpacity>}

<TouchableOpacity onPress={copy}>
<View style={{alignItems: 'center', width: 80}}>
  <Image
    source={{uri: 'https://files.softicons.com/download/toolbar-icons/mono-general-icons-2-by-custom-icon-design/png/512x512/copy.png'}}
    style={{height: 25, width: 25}}
  />
  <Text style={styles.text}>Copy</Text>
  </View>
</TouchableOpacity>
<TouchableOpacity onPress={move}>
<View style={{alignItems: 'center', width: 80}}>
  <Image
    source={{uri: 'https://cdn-icons-png.flaticon.com/512/6469/6469436.png'}}
    style={{height: 25, width: 25}}
  />
  <Text style={styles.text}>Move</Text>
  </View>
</TouchableOpacity>
<TouchableOpacity onPress={deleteSelectedItems}>
<View style={{alignItems: 'center', width: 80}}> 
  <Image
    source={{uri: 'https://cdn-icons-png.flaticon.com/512/3405/3405244.png'}}
    style={{height: 25, width: 25}}
  />
  <Text style={styles.text}>Delete</Text>
  </View>
</TouchableOpacity>
<TouchableOpacity onPress={close}>
<View style={{alignItems: 'center', marginLeft: 10}}>
  <Image
    source={{uri: 'https://cdn0.iconfinder.com/data/icons/pixel-perfect-at-24px-volume-3/24/5003-512.png'}}
    style={{height: 20, width: 20}}
  />
  </View>
</TouchableOpacity>
</View>:null}
    <PopFoodAmount visible={visible}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <View style={styles.header}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Image
                  source={{uri: 'https://static.vecteezy.com/system/resources/previews/018/887/462/original/signs-close-icon-png.png'}}
                  style={{height: 30, width: 30}}
                />
              </TouchableOpacity>
            </View>
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
          <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center", paddingVertical: 10, marginHorizontal: 25}}>
            <Text style={[styles.text, {fontWeight: "bold", fontSize: 18}]}>{(time=='Today'&& language==='vn')?'Hôm nay': time}</Text>
            <Image
                source={require("../assets/calendar_green.png")}
                resizeMode="contain"
                style={[styles.tabIcon, {marginLeft: 5}]}
            />
          </View>
          </TouchableOpacity>
        </View>
      {isUpdate?<TouchableOpacity style={styles.button} onPress={finishMove}>
        <Text style={styles.textBtn}>{language === 'vn' ? 'Chuyển' : 'Move'}</Text>
      </TouchableOpacity>:<TouchableOpacity style={styles.button} onPress={finishCopy}>
        <Text style={styles.textBtn}>{language === 'vn' ? 'Sao chép' : 'Copy'}</Text>
      </TouchableOpacity>}
      </View> 
    </PopFoodAmount>
 </View>

)
}
const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    textAlign: 'center',
    color: '#84D07D',
},
  header: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 25,
    height: 25,
  },
  container: {
    margin: 5,
    borderWidth: 1, 
    borderRadius: 5, 
  },
  textBtn: {
    padding: 10,
    fontSize: 18,
    height: 50,
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    borderRadius: 20,
    width: '50%',
    padding: 5,
    backgroundColor: '#2AE371',
    alignSelf: 'center'
  },
  });
  
  
export default DetailWaterScreen;