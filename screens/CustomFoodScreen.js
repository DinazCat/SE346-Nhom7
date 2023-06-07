import React, {useState, useEffect, useContext} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Dimensions} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Edit, isAdd, createNew, isEditFood } from "../store/CustomFoodSlice";
import PopFoodAmount from "./PopFoodAmount";
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from "../navigation/AuthProvider";
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

const CustomFoodScreen = () => {
  const {user} = useContext(AuthContext);
  const [textSearch, onChangeTextSearch] = useState('');
  const [visible, setVisible] = React.useState(false);//pop to add amount
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const [datas, setDatas] = useState([]);
  const addCustomFood = () => {
    dispatch(createNew())
    dispatch(isAdd(true))
    //can set isEditFood seperately
    navigation.navigate("AddCustomFood");
  }
  const Add = (selectedItem, rowMap) => {
    let index = datas.findIndex(item=>item.id === selectedItem.id)
    rowMap[`${index}`].closeRow();
    onChangeTextSearch('');
    setImage(selectedItem.image);
    
    setName(selectedItem.name);
    setCalories(selectedItem.calories);
   
    setVisible(true);
    
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
    dispatch(Edit(true, selectedItem.ingredients, selectedItem.calories));
    navigation.navigate('AddCustomFood', {item: selectedItem});
   
    
  }
  const finishAdd = () => {
    setVisible(false)
    if (textSearch == ''){
      
    }
    else{
      firestore().collection('foodsDiary').add({
        userId: user.uid,
        name: name,
        mealType: 'Lunch',
        amount: textSearch,
        calories: (parseInt(textSearch) * parseInt(calories)).toFixed(),
        image: image,
        isCustom: true,
      })
    }
    
  }
  useEffect(() => {
    fetchCustomFoods();
    
   }, []);
  const fetchCustomFoods = async()=>{
    try{
      firestore()
      .collection('customFoods')
      .onSnapshot((querySnapshot)=>{
        const list = [];
        querySnapshot.forEach(doc =>{
          const {image, name, calories, cookingTime, ingredients, prepTime, receipt} = doc.data();
          list.push({          
            id: doc.id,
            name: name,
            image: image,
            calories: calories,
            cookingTime: cookingTime,
            prepTime: prepTime,
            receipt: receipt,
            ingredients: ingredients,
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
        />
        <TouchableOpacity onPress={()=>addCustomFood()}>
          <Text>Add</Text>
        </TouchableOpacity>
        </View>
         {/* Chỉ sửa giao diện của renderItem thôi */}
          <SwipeListView
          useFlatList={true}
               data={datas}
               renderItem={({item}) => (
                 <View  style={styles.rowFront}> 
                   
                       <Image source={{uri: item.image}} style={styles.tabIcon}/>
                       <Text > {item.name} </Text>
                       <Text > {item.calories}cals/serving  </Text>
                       
 
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
        <Text>{calories}cals/serving</Text>
        </View>
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
    popover:{
      backgroundColor: 'white', 
      borderRadius: 10, 
      padding: 16, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
    },
    popoverItem:{
      alignItems: 'center',
      margin: 20
  },
  backTextWhite: {
    color: '#FFF',
},
//custom for options

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
    backgroundColor: 'blue',
    right: 150,
},
backEdit: {
    backgroundColor: 'red',
    right:75,
},
backDelete: {
  backgroundColor: '#D436F0',
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
