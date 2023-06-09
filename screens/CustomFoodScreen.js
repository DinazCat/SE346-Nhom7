import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext, useEffect} from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import * as Progress from 'react-native-progress';
import PopFoodAmount from "./PopFoodAmount";

const CustomFoodScreen = (props, {route}) => {
    const navigation = useNavigation();
    const baseGoal = useSelector((state)=>state.CaloriesDiary.baseGoal);
  const exercise = useSelector((state)=>state.CaloriesDiary.exercise);
  const caloriesBudget = parseInt(baseGoal) + parseInt(exercise);
   const language = useContext(LanguageContext)
   const theme = useContext(ThemeContext)
    const {user} = useContext(AuthContext);
    const [textSearch, onChangeTextSearch] = useState('');
    const nameScreen = props.nameScreen;
    const [datas, setDatas] = useState([]);
    const addCustomFood = () => {
      navigation.navigate('DetailFood');
    }
    const Add = (selectedItem, rowMap) => {
      let index = datas.findIndex(item=>item.id === selectedItem.id)
      rowMap[`${index}`].closeRow();
      navigation.navigate('EditFood', {item:selectedItem, isEdit:false, mealType: props.mealType, nameScreen: nameScreen})
    }
    
    const Delete = (selectedItem, rowMap) => {
      let index = datas.findIndex(item=>item.id === selectedItem.id)
      rowMap[`${index}`].closeRow();
      Alert.alert(language==='vn'?'Xóa':'Delete', language==='vn'?'Bạn có chắc chắc muốn xóa?':'Do you want to remove', [
        {
          text: language==='vn'?'Hủy':'Cancel',
          
          style: 'cancel',
        },
        {text: language==='vn'?'Đồng ý':'OK', onPress: () => {
          firestore().collection('customFoods').doc(selectedItem.id).delete().then(() => {});
        }},
      ]);
      
    }
    const is_edit = (selectedItem, rowMap) =>{
      //có thể bị vướng id do navigation lại mất
      let index = datas.findIndex(item=>item.id === selectedItem.id)
      rowMap[`${index}`].closeRow();
      //dispatch(Edit(true, selectedItem.ingredients, selectedItem.calories));
      navigation.navigate('DetailFood', {item: selectedItem});
     
      
    }
   
    useEffect(() => {
      fetchCustomFoods();
      
     }, []);
    const fetchCustomFoods = async()=>{
      try{
        firestore()
        .collection('customFoods')
        .where('userId', '==', user.uid)
        .onSnapshot((querySnapshot)=>{
          const list = [];
          querySnapshot.forEach(doc =>{
            const {image, name, baseAmount, unit, calories, carbs, fat, protein} = doc.data();
            list.push({          
              id: doc.id,
              name: name,
              image: image,
              calories: calories,
              carbs: carbs,
              protein: protein,
              fat: fat,
              baseAmount: baseAmount,
              unit: unit,
              calories: calories
            });
          })
          setDatas(list);
  
        })
       
      } catch(e){
        console.log(e);
      }
    }
    
    //for item options of flatlist
    const onRowDidOpen = rowKey => {
      console.log('This row opened', rowKey);
  };
    
    
      return (
        <View>
        <View style={{flexDirection:'row', marginTop: 10, marginHorizontal: 10, alignItems: 'center'}}>
        <Icon name={'search'} size={25} color={theme==='light'?'#000':'#fff'}/>
        <TextInput 
        value={textSearch}
        onChangeText={onChangeTextSearch}
        style={[styles.textInput, {marginStart: 7, fontSize: 17, color: theme==='light'?"#000":"#fff", borderColor: theme==='light'?"#000":"#fff"}]}
        placeholder={language === 'vn' ? 'Tìm kiếm món ăn' : 'Search food'}
        placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
          />
          </View>
          <View>
          
          </View>
          
           <View style={{marginTop: 7, marginBottom: 140}}>
           <TouchableOpacity onPress={()=>addCustomFood()} style={{marginLeft:'auto', marginHorizontal: 15, marginBottom: 7}}>
                <Icon name={'plus-circle'} size={30} color={'#0AD946'}/>
          </TouchableOpacity>
            <SwipeListView  
            useFlatList={true}
                 data={datas.filter(item=>item.name.toLowerCase().includes(textSearch.toLowerCase()))}
                 renderItem={({item}) => (
                   <View style={styles.rowFront}> 
                   <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 15, marginVertical: 3, paddingBottom: 5}}>
                      <Image source = {{uri: item.image}} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <Text style={{fontSize: 18, width: 200, marginStart: 3}}>{item.name}</Text>
                      <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.calories} cals</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.baseAmount} {item.unit}</Text>
                      </View>
                  </View>
                   </View>
                 
                 )}
                 //
                 renderHiddenItem={ ({item}, rowMap) => (
                   <View style={styles.rowBack}>
               <TouchableOpacity onPress={() => Add(item, rowMap)}
                   style={[styles.backRightBtn, styles.backAdd]}
               >
                   <Text style={styles.backTextWhite}>{language === 'vn' ? 'Thêm' : 'Add'}</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>Delete(item, rowMap)}
                   style={[styles.backRightBtn,styles.backEdit]}
               >
                   <Text style={styles.backTextWhite}>{language === 'vn' ? 'Xóa' : 'Delete'}</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>is_edit(item, rowMap)}
                   style={[styles.backRightBtn,styles.backDelete]}
               >
                   <Text style={styles.backTextWhite}>{language === 'vn' ? 'Sửa' : 'Edit'}</Text>
               </TouchableOpacity>
           </View>
               )}
               keyExtractor={(item, index)=>index.toString()}
                 disableRightSwipe
                   rightOpenValue={-225}//lấy 75 nhân vs số button cần làm
                   //previewRowKey={'0'}
                   previewOpenValue={-40}
                   previewOpenDelay={3000}
                   onRowDidOpen={onRowDidOpen}//đếm vị trí mở
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
    padding: 10,
    fontSize: 18,
    height: 50,
    textAlign: 'center'
},
  header: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    height: 50,
  },
button: {
  marginTop: 15,
  borderRadius: 20,
  width: '40%',
  padding: 5,
  backgroundColor: '#2AE371',
  alignSelf: 'center'
},
rowBack: {
  alignItems: 'center',
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
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
backAdd: {
  backgroundColor: 'red',
  right:150,
},
backDelete: {
backgroundColor: '#D436F0',
right: 75,
},
backEdit:{
backgroundColor: '#E3912C',
right: 0,
},
rowFront: {
backgroundColor: '#CCC',
justifyContent: 'center',
flex: 1
},
});
  
export default CustomFoodScreen;