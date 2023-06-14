import React, {useState, useEffect, useContext} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Dimensions} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Edit, isAdd, createNew, isEditFood } from "../store/CustomRecipeSlice";
import PopFoodAmount from "./PopFoodAmount";
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from "../navigation/AuthProvider";
import { SwipeListView} from 'react-native-swipe-list-view';
import { Picker } from '@react-native-picker/picker';
import moment from "moment";

const CustomRecipeScreen = () => {
  const {user} = useContext(AuthContext);
  const [textSearch, onChangeTextSearch] = useState('');//nhập gram
  const [visible, setVisible] = React.useState(false);//pop to add amount
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [selectedValue, setSelectedValue] = useState("Breakfast");//value cho meal types
  
  const [textInput, onChangeTextInput] = useState('');

  //const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const [datas, setDatas] = useState([]);
  const addCustomFood = () => {
    dispatch(createNew())
    //can set isEditFood seperately
    navigation.navigate("AddCustomRecipe");
  }
  const deleteAll = async() => {
    //for(let i = 0; i < datas.length; i++){
      //firestore().collection('customFoods').doc(datas[i].id).delete().then(() => {});
    //}
    const customFoodList = await firestore()
      .collection('customRecipe')
      .where('userId', '==', user.uid)
      customFoodList.get().then((querySnapshot) => {
        Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
      });
  }
  const Delete = (selectedItem, rowMap) => {
    let index = datas.findIndex(item=>item.id === selectedItem.id)
    rowMap[`${index}`].closeRow();
    firestore().collection('customRecipe').doc(selectedItem.id).delete().then(() => {});
    
  }
  const is_edit = (selectedItem, rowMap) =>{
    //có thể bị vướng id do navigation lại mất
    let index = datas.findIndex(item=>item.id === selectedItem.id)
    rowMap[`${index}`].closeRow();
    dispatch(Edit(true, selectedItem.ingredients, selectedItem.calories));
    navigation.navigate('AddCustomRecipe', {item: selectedItem});
  }
  const Share = (selectedItem, rowMap)=>{
    let index = datas.findIndex(item=>item.id === selectedItem.id)
    rowMap[`${index}`].closeRow();
    const ingredientsShare = []
    for (let i = 0; i < selectedItem.ingredients.length; i++){
      ingredientsShare.push({id:i,name:selectedItem.ingredients[i].name, wty:selectedItem.ingredients[i].amount.toString(), dv:selectedItem.ingredients[i].unit.toString()})
    }


    navigation.navigate('AddPostScreen', {name:selectedItem.name, calories: selectedItem.calories.toString(), prepTime: selectedItem.prepTime, cookingTime: selectedItem.cookingTime, image: selectedItem.image, receipt: selectedItem.receipt, total:'1', ingredients: ingredientsShare})
  }
  
  
  useEffect(() => {
    fetchCustomFoods();
    
   }, []);
  const fetchCustomFoods = async()=>{
    try{
      firestore()
      .collection('customRecipe')
      .where("userId", '==', user.uid)
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
        value={textInput}
        onChangeText={onChangeTextInput}
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
               data={datas.filter(item=>item.name.toLowerCase().includes(textInput.toLowerCase()))}
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
             <TouchableOpacity onPress={()=>Share(item, rowMap)}
                 style={[styles.backRightBtn,styles.backShare]}
             >
                 <Text style={styles.backTextWhite}>Share</Text>
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
backEdit: {
    backgroundColor: 'red',
    right:150,
},
backDelete: {
  backgroundColor: '#D436F0',
  right: 75,
},
backShare:{
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
export default CustomRecipeScreen;
