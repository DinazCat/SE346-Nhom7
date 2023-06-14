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

import PopFoodAmount from "./PopFoodAmount";

const CustomFoodScreen = (props, {route}) => {
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
        <View style={{flexDirection:'row'}}>
          <Icon name={'search'} />
          <TextInput
          placeholder="Search food"
        placeholderTextColor={'rgba(0,0,0,0.8)'}
        value={textSearch}
        onChangeText={onChangeTextSearch}
          />
          <TouchableOpacity onPress={()=>addCustomFood()}>
            <Text>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginVertical: 30, fontSize: 20, textAlign: 'center'}} onPress={()=>deleteAll()}>
            <Text>Delete All</Text>
          </TouchableOpacity>
          </View>
           {/* Chỉ sửa giao diện của renderItem thôi */}
            <SwipeListView
            useFlatList={true}
                 data={datas.filter(item=>item.name.toLowerCase().includes(textSearch.toLowerCase()))}
                 renderItem={({item}) => (
                   <View  style={styles.rowFront}> 
                     
                         <Image source={{uri: item.image}} style={styles.tabIcon}/>
                         <Text > {item.name} </Text>
                         <Text > {item.calories}cals/{item.baseAmount}{item.unit} </Text>
                         
   
                   </View>
                 
                 )}
                 //
                 renderHiddenItem={ ({item}, rowMap) => (
                   <View style={styles.rowBack}>
               <TouchableOpacity onPress={() => Add(item, rowMap)}
                   style={[styles.backRightBtn, styles.backAdd]}
               >
                   <Text style={styles.backTextWhite}>Add</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>Delete(item, rowMap)}
                   style={[styles.backRightBtn,styles.backEdit]}
               >
                   <Text style={styles.backTextWhite}>Delete</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>is_edit(item, rowMap)}
                   style={[styles.backRightBtn,styles.backDelete]}
               >
                   <Text style={styles.backTextWhite}>Edit</Text>
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
   
  
            <PopFoodAmount visible={visible}>
          <View style={{alignItems: 'center'}}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Image
                  source={require('../assets/food.png')}
                  style={{height: 30, width: 30}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{uri: image}}
              style={{height: 100, width: 100, marginVertical: 10}}
            />
          </View>
          <View >
          <TextInput style={{marginVertical: 30, fontSize: 20}} value={textSearch} onChangeText={textSearch  =>onChangeTextSearch(textSearch)}/>
          <Text>{unit}</Text>
          <Text>{calories}cals/{baseAmount}{unit}</Text>
          </View>
          <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Breakfast" value="Breakfast" />
        <Picker.Item label="Lunch" value="Lunch" />
        <Picker.Item label="Dinner" value="Dinner" />
        <Picker.Item label="Snacks" value="Snacks" />
      </Picker>
          <TouchableOpacity style={{marginVertical: 30, fontSize: 20, textAlign: 'center'}} onPress={()=>finishAdd()}>
            <Text>Add</Text>
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
      alignItems: 'center',
      backgroundColor: '#CCC',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      justifyContent: 'center',
    },
      });
  
export default CustomFoodScreen;