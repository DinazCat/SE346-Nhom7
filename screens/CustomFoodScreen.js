import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext, useEffect} from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useDispatch } from "react-redux";
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import LanguageContext from "../context/LanguageContext";

import PopFoodAmount from "./PopFoodAmount";

const CustomFoodScreen = (props, {route}) => {
   const language = useContext(LanguageContext)
    const {user} = useContext(AuthContext);
    const [textSearch, onChangeTextSearch] = useState('');
    const [visible, setVisible] = React.useState(false);//pop to add amount
    const [calories, setCalories] = useState('');
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [baseAmount, setBaseAmount] = useState('');
    const [unit, setUnit] = useState('');
    const dispatch = useDispatch();
    const [datas, setDatas] = useState([]);
    const [selectedValue, setSelectedValue] = useState("Breakfast");//value cho meal types
    const addCustomFood = () => {
      navigation.navigate("DetailFood");
    }
    const Add = (selectedItem, rowMap) => {
      let index = datas.findIndex(item=>item.id === selectedItem.id)
      rowMap[`${index}`].closeRow();
      onChangeTextSearch('');
      setImage(selectedItem.image);
      setBaseAmount(selectedItem.baseAmount);
      setUnit(selectedItem.unit);
      setName(selectedItem.name);
      setCalories(selectedItem.calories);
     
      setVisible(true);
      
    }
    const deleteAll = async() => {
      //for(let i = 0; i < datas.length; i++){
        //firestore().collection('customFoods').doc(datas[i].id).delete().then(() => {});
      //}
      const customFoodList = await firestore()
        .collection('customFoods')
        .where('userId', '==', user.uid)
        customFoodList.get().then((querySnapshot) => {
          Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
        });
    }
    const Delete = (selectedItem, rowMap) => {
      let index = datas.findIndex(item=>item.id === selectedItem.id)
      rowMap[`${index}`].closeRow();
      firestore().collection('customFoods').doc(selectedItem.id).delete().then(() => {});
      
    }
    const is_edit = (selectedItem, rowMap) =>{
      //có thể bị vướng id do navigation lại mất
      let index = datas.findIndex(item=>item.id === selectedItem.id)
      rowMap[`${index}`].closeRow();
      //dispatch(Edit(true, selectedItem.ingredients, selectedItem.calories));
      navigation.navigate('DetailFood', {item: selectedItem});
     
      
    }
    const finishAdd = () => {
      setVisible(false)
      if (textSearch == ''){
        
      }
      else{
        firestore().collection('foodsDiary').add({
          userId: user.uid,
          name: name,
          time: props.date,
          unit: unit,
          mealType: selectedValue,
          amount: textSearch,
          calories: (parseInt(textSearch) * parseInt(calories) / parseInt(baseAmount)).toFixed(),
          image: image,
          isCustom: true,
        })
        if(props.isNavigation){
          navigation.goBack();
        }
      }
      
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
            const {image, name, baseAmount, unit, calories} = doc.data();
            list.push({          
              id: doc.id,
              name: name,
              image: image,
              calories: calories,
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
    const navigation = useNavigation();
    
      return (
        <View styles={{flex:1}}>
        <View style={{flexDirection:'row', marginTop: 10, marginHorizontal: 10, alignItems: 'center'}}>
        <Icon name={'search'} size={25}/>
        <TextInput 
        value={textSearch}
        onChangeText={onChangeTextSearch}
        style={[styles.textInput, {marginStart: 7, fontSize: 17}]}
        placeholder={language === 'vn' ? 'Tìm kiếm món ăn' : 'Search food'}
          />
          </View>
          <View>
          
          </View>
          
           <View style={{marginTop: 10, marginBottom: 310}}>
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
                   onRowDidOpen={onRowDidOpen}//đếm số lần mở ra mở vô
                   recalculateHiddenLayout={true}
                />
                
   </View>
   
            <PopFoodAmount visible={visible}>
          <View style={{alignItems: 'center'}}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Image
                  source={{uri: 'https://static.vecteezy.com/system/resources/previews/018/887/462/original/signs-close-icon-png.png'}}
                  style={{height: 30, width: 30}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{alignItems: 'center', justifyContent:'center', flexDirection: 'row'}}>
          <Image
            source={{uri:image}}
            style={{height: 110, width: 110, marginVertical: 10}}
          />
          <View style={{marginStart: 15}}>
            <Text style={{fontSize: 16, width: 150}}>{name}</Text>
            <Text style={{fontSize: 16}}>{calories} cals/{(baseAmount!='1')?baseAmount+" ":''}{unit}</Text>
          </View>
          </View>
          <View style={{flexDirection: 'row'}}>
          <TextInput style={[styles.textInput, {width: 220}]} value={textSearch} onChangeText={textSearch  =>onChangeTextSearch(textSearch)}/>
          <Text style={styles.text}>{unit}</Text>
          </View>
          <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 200, marginStart: 10}}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Breakfast" value="Breakfast" />
        <Picker.Item label="Lunch" value="Lunch" />
        <Picker.Item label="Dinner" value="Dinner" />
        <Picker.Item label="Snacks" value="Snacks" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={()=>isAddIngredient()}>
          <Text style={styles.text}>{language === 'vn' ? 'Thêm' : 'Add'}</Text>
        </TouchableOpacity>
          
        </PopFoodAmount>
  
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

  tabIcon: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
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
  marginBottom: 3
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
paddingHorizontal: 5,
marginBottom: 3
},
});
  
export default CustomFoodScreen;