import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from "react";
import moment, { lang } from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import { SwipeListView } from "react-native-swipe-list-view";
import PopFoodAmount from "./PopFoodAmount";
import CheckBox from "@react-native-community/checkbox";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Progress from 'react-native-progress';
import { GestureHandlerRootView, Swipeable, ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { Picker } from '@react-native-picker/picker';
const DetailMealScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const [mealType, setMealType] = useState(route.params?.mealType);
    const tempMealType = route.params?.mealType
    const [meal, setMeal] = useState(0);
    const [mealList, setMealList] = useState([]);
    const theme = useContext(ThemeContext);
    const language = useContext(LanguageContext);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const baseGoal = useSelector((state)=>state.CaloriesDiary.baseGoal);
    const exercise = useSelector((state)=>state.CaloriesDiary.exercise);
    const caloriesBudget = parseInt(baseGoal) + parseInt(exercise);
    const row = [];
    let prevOpenedRow;
    const [isOpen, setOpen] = useState(false);
    const [isAll, setIsAll] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [show, setShow] = useState(false);
    const [time, setTime] = useState((route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time);
    const tempTime = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time
    const [date, setDate] = useState(route.params?.time == 'Today'? new Date(): new Date(moment(route.params?.time, 'DD/MM/YYYY')));
    useEffect(() => {
        getMealType(tempTime)
    }, []);
    const back = () => {
      navigation.goBack();
      none();
    }
    const Add = () => {
      navigation.navigate('AddFoodScreen', {date: tempTime, mealType: tempMealType})
      none();
    }
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
       setShow(false);
       setDate(currentDate);
       setTime(moment(new Date(currentDate)).format('DD/MM/YYYY'));
   }
   const all = async(index) => {
    if(index >= 0) row[index].close();
    setOpen(true);
    //setIsAll(false)
    const usersQuerySnapshot = await firestore().collection('foodsDiary')
    .where("userId", '==', user.uid)
    .where("time", '==', tempTime).get();
    const batch = firestore().batch();
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.update(documentSnapshot.ref, {"isChecked": true});
    });
    return batch.commit();
  }
  const deleteSelectedItems = async() => {
    const usersQuerySnapshot = await firestore().collection('foodsDiary')
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
    const usersQuerySnapshot = await firestore().collection('foodsDiary')
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
    firestore().collection('foodsDiary').doc(item.id).update({
      isChecked : true
    })
    setOpen(true);
  }
  const move = () => {
    setIsUpdate(true);
    setMealType(route.params?.mealType)
    setDate((route.params?.time == 'Today'? new Date(): new Date(moment(route.params?.time, 'DD/MM/YYYY'))))
    setTime((route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time)
    setVisible(true);
  }
  const finishMove = async() => {
    setVisible(false);
    const usersQuerySnapshot = await firestore().collection('foodsDiary')
    .where("userId", '==', user.uid)
    .where("time", '==', tempTime)
    .where("isChecked", '==', true).get();
    const batch = firestore().batch();
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.update(documentSnapshot.ref, {"isChecked": false, "time": time, "mealType": mealType});
    });

    return batch.commit();
  }
  const copy = () => {
    setIsUpdate(false);
    setDate((route.params?.time == 'Today'? new Date(): new Date(moment(route.params?.time, 'DD/MM/YYYY'))))
    setMealType(route.params?.mealType)
    setTime((route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time)
    setVisible(true);
  }
  const finishCopy = async() => {
    setVisible(false);
    const usersQuerySnapshot = await firestore().collection('foodsDiary')
    .where("userId", '==', user.uid)
    .where("time", '==', tempTime)
    .where("mealType", '==', tempMealType)
    .where("isChecked", '==', true).get();
    const batch = firestore().batch();
    usersQuerySnapshot.forEach(documentSnapshot => {
      const data = documentSnapshot.data();
      const foodRef = firestore().collection('foodsDiary')
      const id = foodRef.doc().id
      batch.set(foodRef.doc(id), {
        userId: user.uid,
        time: time,
        name: data.name,
        unit: data.unit,
        mealType: mealType,
        amount: data.amount,
        carbs: data.carbs,
        fat: data.fat,
        protein: data.protein,
        baseFat: data.baseFat,
        baseCarbs: data.baseCarbs,
        baseProtein: data.baseProtein,
        baseAmount: data.baseAmount,
        baseCalories: data.baseCalories,
        calories: data.calories,
        image: data.image,
        isCustom: data.isCustom,
        isChecked: false
      })
    });

    return batch.commit();
  }
  const edit = (item) => {
    navigation.navigate("EditFood", {item:item})
  }
  const closeRow = (index) => {
    if(prevOpenedRow && prevOpenedRow !== row[index]){
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  }
   
    const deleteFoodsDiary = (item) => {
      Alert.alert('Delete', 'Do you want to remove food?', [
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
          .where("mealType", '==', tempMealType)
          .onSnapshot((querySnapshot)=>{
            let total = 0;
            let list= [];
            let sumCarbs = 0;
            let sumFat = 0;
            let sumProtein = 0;
            let checkList = [];
            querySnapshot.forEach(doc =>{
              const {calories, image, name, amount, unit, mealType, carbs, fat, protein, baseAmount, baseFat, baseProtein, baseCarbs, isChecked, baseCalories} = doc.data();
              total += parseInt(calories);
              sumCarbs += parseInt(carbs);
              sumFat += parseInt(fat);
              sumProtein += parseInt(protein);
              if (!isChecked) checkList.push(isChecked);
              list.push({          
                id: doc.id,
                amount: amount,
                calories: calories,
                image: image,
                name: name,
                amount: amount,
                unit: unit,
                mealType: mealType,
                baseCalories: baseCalories,
                baseAmount: baseAmount,
                baseCarbs: baseCarbs,
                baseProtein: baseProtein,
                baseFat: baseFat,
                isChecked: isChecked
              });
            })
            setMealList(list);
            setMeal(total);
            setTotalCarbs(sumCarbs);
            setTotalFat(sumFat);
            setTotalProtein(sumProtein);
            if(checkList.length > 0) setIsAll(true);
              else setIsAll(false);
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
      
      {tempMealType === 'Breakfast' ?  
      (<Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>
          {language==='vn'?'Sáng': tempMealType}
      </Text>)
      :
      tempMealType === 'Lunch'?  
      (<Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>
          {language==='vn'?'Trưa': tempMealType}
      </Text>)
      :
      tempMealType === 'Dinner'?
      (<Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>
          {language==='vn'?'Tối': tempMealType}
      </Text>)
      :tempMealType === 'Snacks'?
      (<Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>
          {language==='vn'?'Ăn vặt': tempMealType}
      </Text>)
      :
      (null)
      }
      <Text style={{marginLeft: 'auto', color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{(meal > 0)? meal+" cals": ''}</Text>
    </View>
    <ScrollView>
    {mealList?.map((item, index)=>{
      
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
deleteFoodsDiary(item)
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
        <Image source = {{uri: item.image}} style={{width: 40,
height: 40,
resizeMode: 'stretch'}}/>
        <Text style={{fontSize: 18, width: 200, marginStart: 3}}>{item.name}</Text>
        <View style={{marginLeft:'auto'}}>
        <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.calories} cals</Text>
        <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.amount} {item.unit}</Text>
        </View>
        {isOpen?<CheckBox
        value={item.isChecked}
        onValueChange={(value)=>{
            firestore().collection('foodsDiary').doc(item.id).update({
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
        <View style={{marginHorizontal: 15, marginTop: 7}}>
    <Text style={{color: theme==='light'?"#000":"#fff", fontWeight: 'bold', fontSize: 17}}>{language==='vn'?'Hàm lượng dinh dưỡng':'Macros'}</Text>
       <View style={{marginVertical:3}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#5ADFC8', marginRight: 5}}>Carbs</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{totalCarbs}g, {(parseInt(totalCarbs)*40000/(caloriesBudget*45)).toFixed()}% {language=='vn'?'của Mục tiêu':'of Target'}</Text>
        </View>
        <Progress.Bar progress={parseInt(totalCarbs)*400/(caloriesBudget*45)} width={380} color="#5ADFC8"/>
        </View>
        <View style={{marginVertical:3}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#CE65E0', marginRight: 5}}>{language==='vn'?'Chất đạm':'Protein'}</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{totalProtein}g, {(parseInt(totalProtein)*2000/(caloriesBudget)).toFixed()}% {language=='vn'?'của Mục tiêu':'of Target'}</Text>
        </View>
        <Progress.Bar progress={parseInt(totalProtein)*20/(caloriesBudget)} width={380} color="#CE65E0"/>
        </View>
        <View style={{marginTop: 3, marginBottom: 10}}>
          <View style={{flexDirection: 'row', marginVertical:10}}> 
          <Text style={{color: '#E8B51A', marginRight: 5}}>{language==='vn'?'Chất béo':'Fat'}</Text>
        <Text style={{color: theme==='light'?"#000":"#fff"}}>{totalFat}g, {(parseInt(totalFat)*90000/(caloriesBudget*35)).toFixed()}% {language=='vn'?'của Mục tiêu':'of Target'}</Text>
        </View>
        <Progress.Bar progress={parseInt(totalFat)*900/(caloriesBudget*35)} width={380} color="#E8B51A"/>
        </View>
        </View>
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
                source={require("../assets/calendar.png")}
                resizeMode="contain"
                style={[styles.tabIcon, {marginLeft: 5}]}
            />
          </View>
          </TouchableOpacity>
        </View>
        <Picker
        selectedValue={mealType}
        style={{ height: 50, width: 200, alignSelf: 'center'}}
        onValueChange={(mealType) => setMealType(mealType)}
      >
        <Picker.Item label={language==='vn'? 'Buổi sáng': 'Breakfast'} value="Breakfast" />
        <Picker.Item label={language==='vn'? 'Buổi trưa': 'Lunch'}  value="Lunch" />
        <Picker.Item label={language==='vn'? 'Buổi tối': 'Dinner'}  value="Dinner" />
        <Picker.Item label={language==='vn'? 'Ăn vặt': 'Snacks'}  value="Snacks" />
      </Picker>
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
export default DetailMealScreen;