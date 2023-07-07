import React, {useState, useEffect, useContext} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert} from "react-native";
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
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";

const CustomRecipeScreen = () => {
  const language = useContext(LanguageContext)
  const theme = useContext(ThemeContext)
  const {user} = useContext(AuthContext);
  const [textSearch, onChangeTextSearch] = useState('');//nhập gram
  const [visible, setVisible] = React.useState(false);//pop to add amount
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
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
    Alert.alert(language==='vn'?'Xóa':'Delete', language==='vn'?'Bạn có chắc chắc muốn xóa?':'Do you want to remove', [
      {
        text: language==='vn'?'Hủy':'Cancel',
        
        style: 'cancel',
      },
      {text: language==='vn'?'Đồng ý':'OK', onPress: () => {
        firestore().collection('customRecipe').doc(selectedItem.id).delete().then(() => {});
      }},
    ]);
    
  }
  const is_edit = (selectedItem, rowMap) =>{
    //có thể bị vướng id do navigation lại mất
    let index = datas.findIndex(item=>item.id === selectedItem.id)
    rowMap[`${index}`].closeRow();
    dispatch(Edit(true, selectedItem.ingredients, selectedItem.calories, selectedItem.fat, selectedItem.carbs, selectedItem.protein));
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
          const {image, name, calories, cookingTime, ingredients, prepTime, receipt, carbs, protein, fat} = doc.data();
          list.push({          
            id: doc.id,
            name: name,
            image: image,
            calories: calories,
            carbs: carbs,
            protein: protein,
            fat: fat,
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
      <View >
        <View style={{flexDirection:'row', marginTop: 10, marginHorizontal: 10, alignItems: 'center'}}>
        <Icon name={'search'} size={25} color={theme==='light'?'#000':'#fff'}/>
        <TextInput
        style={[styles.textInput, {marginStart: 7, fontSize: 17, color: theme==='light'?"#000":"#fff", borderColor: theme==='light'?"#000":"#fff"}]}
        placeholder={language === 'vn' ? 'Tìm kiếm công thức' : 'Search recipe'}
        value={textInput}
        onChangeText={onChangeTextInput}
        placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
        />
       
        </View >
        <View style={{marginTop: 7, marginBottom: 140}}>
        <TouchableOpacity style={{marginLeft:'auto', marginHorizontal: 15, marginBottom: 7}} onPress={()=>addCustomFood()}>
          <Icon name={'plus-circle'} size={30} color={'#0AD946'}/>
        </TouchableOpacity>
          <SwipeListView 
          useFlatList={true}
               data={datas.filter(item=>item.name.toLowerCase().includes(textInput.toLowerCase()))}
               renderItem={({item}) => (
                <View style={styles.rowFront}> 
                <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 15, marginVertical: 3, paddingBottom: 5}}>
                   <Image source = {{uri: item.image}} style={{width: 40,
     height: 40,
     resizeMode: 'stretch'}}/>
                       <Text > {item.name} </Text>
                       <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.calories} cals</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>1 serving</Text>
                      </View>
                       </View>
 
                 </View>
               
               )}
               //
               renderHiddenItem={ ({item}, rowMap) => (
                 <View style={styles.rowBack}>
            
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
             <TouchableOpacity onPress={()=>Share(item, rowMap)}
                 style={[styles.backRightBtn,styles.backShare]}
             >
                 <Text style={styles.backTextWhite}>{language === 'vn' ? 'Chia sẻ' : 'Share'}</Text>
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
                 ItemSeparatorComponent={()=> (
                  <View
      style={{
        height: 2,
        backgroundColor: "#fff",
      }}
    />
                 )}
                 recalculateHiddenLayout={true}
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
  backgroundColor: '#CCC',
justifyContent: 'center',
flex: 1
},
  });
export default CustomRecipeScreen;
