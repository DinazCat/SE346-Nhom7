import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, SafeAreaView, ScrollView, Alert, FlatList} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import firestore from '@react-native-firebase/firestore';
import { Delete, DeleteAll } from "../store/CustomRecipeSlice";
import { AuthContext } from '../navigation/AuthProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Popover from 'react-native-popover-view';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import { SwipeListView } from "react-native-swipe-list-view";

const AddCustomRecipe = ({route}) => {
  const {user} = useContext(AuthContext)
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const IngredientList= useSelector((state) => state.IngredientList.value);
  const totalCalories = useSelector((state) => state.IngredientList.totalCalories);
  const isEdit = useSelector((state) => state.IngredientList.isEdit);
  const imageTemp = (route.params)? route.params?.item.image :'https://cdn-icons-png.flaticon.com/512/2927/2927347.png'
  //mấy cái để http bà có thể tìm ảnh khác dể dô cho đẹp nha
  
  const navigation = useNavigation();
  //thông tin textinput của customFood
  const [name, setName] = useState(route.params?.item.name)
  const [image,setImage] = useState(null);
  const [prepTime, setPrepTime] = useState(route.params?.item.prepTime);
  const [cookingTime, setCookingtime] = useState(route.params?.item.cookingTime)
  const [receipt, setReceipt] = useState(route.params?.item.receipt)
  const [id, setId] = useState(route.params?.item.id)//set route.params...vô trong const trước
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const language = useContext(LanguageContext);

  const cancel = () => {
    navigation.goBack();
  }
  //thêm ảnh 
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const pickImageAsync = () => {
    setPopoverVisible(false);
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(img => {
      setImage(img);  
    });
  };
  const takePhotoFromCamera = () => {
    setPopoverVisible(false);
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((img) => {
      setImage(img);  
    });
  };
  const uploadImage = async (image)=>{
    if(image == null) return imageTemp;
      const uploadUri = image;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1);
      const extension = filename.split('.').pop();
       const name = filename.split('.').slice(0,-1).join('.');
       filename = name + Date.now() + '.' + extension;
      setTransferred(0);
      setUploading(true);
      const storageRef = storage().ref('photos/'+filename.toString());
      const task = storageRef.putFile(uploadUri);
      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        setTransferred(
         Math(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes)*100
        )
      });
      try{
          await task;
          const url = await storageRef.getDownloadURL();
          setUploading(false);
          return url;

      } catch(e){
          console.log(e);
          return null;
      }
  }

  //thêm nguyên liệu
  const addIngredient = () => {
   
    navigation.navigate('IngredientScreen')
  }
  const deleteAll = () => {
    dispatch(DeleteAll());
  }

  const DeleteIngredient = (index) => {
    Alert.alert('Delete', 'Do you want to remove ingredient?', [
      {
        text: 'Cancel',
        
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {
        
        dispatch(Delete(index))
      }},
    ]);
  }
  const saveRecipe = async() => {
    try{
      const imageUrl = await uploadImage(image?.path);
      firestore().collection('customRecipe').add({
      userId: user.uid,
      name: name || '',
      image: imageUrl,
      calories: totalCalories || '',
      prepTime: prepTime || '',
      cookingTime: cookingTime || '',
      receipt: receipt|| '',
      ingredients: IngredientList || [],
      })
      
      console.log('recipe added');
      Alert.alert(
        'Add Recipe successfully!'
      );
      navigation.goBack();
    } 
    catch (error) {
      console.log('something went wrong!', error);
    }
  }
  const checkNameAndIngredient = () => {
    Alert.alert(
      'Name and ingredient cannot be blank'
    );
  }
  const updateRecipe = async() => {
      try{
        const imageUrl = await uploadImage(image?.path);
        await firestore().collection('customRecipe').doc(id).update({
        name: name,
        image: imageUrl,
        calories: totalCalories,
        prepTime: prepTime,
        cookingTime: cookingTime,
        receipt: receipt,
        ingredients: IngredientList,
        })
        
        console.log('custom recipe updated');
        Alert.alert(
          'Update custom recipe succesfully!'
        );
        navigation.goBack();
      } 
      catch (error) {
        console.log('something went wrong!', error);
      }
  }
  

  // add image
  return (
    <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 15, backgroundColor: theme === 'light' ?'#2AE371': '#747474'}}>
    <TouchableOpacity onPress={cancel}>
        <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Hủy' : 'Cancel'}</Text>
      </TouchableOpacity>
      <Text style={{fontSize: 23, color: '#fff', fontWeight: 'bold', textAlign: 'center', width: 250}}>{language === 'vn' ? 'Chi tiết công thức' : 'Recipe detail'}</Text>
     {isEdit?<TouchableOpacity onPress={(IngredientList.length == 0||name=='')?checkNameAndIngredient:updateRecipe}>
      <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Cập nhật' : 'Update'}</Text>
     </TouchableOpacity> :
     <TouchableOpacity onPress={(IngredientList.length == 0||name=='')?checkNameAndIngredient
     :saveRecipe}>
        <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Lưu' : 'Save'}</Text>
     </TouchableOpacity> }
     </View> 
            <View style={styles.headerContainer}>
            <TextInput style={[styles.foodname, {color: theme === 'light' ?'#000': '#fff', borderColor: theme==='light'?"#000":"#fff"}]} 
            placeholder={language === 'vn' ? 'Nhập tên món ăn' : 'Enter food name'} 
            placeholderTextColor={theme==='light'?'#C7C7CD':'#A3A3A3'}
            
            value={name} onChangeText={name=>setName(name)}></TextInput>
            </View>
                
        <View style={[styles.Container, {flex: 1, backgroundColor: theme==='light'?"#fff":"#000"}]}>
            <ScrollView>               
                    <>
                    <View style={styles.foodInfoWrapper}>
                        <View style={styles.foodInfoItem}>
                        <TextInput style={styles.foodInfoTitle} 
                        placeholder={language === 'vn' ? 'thời gian' : 'time'}
                        placeholderTextColor={theme==='light'?'#C7C7CD':'#A3A3A3'} 
                        value={prepTime} onChangeText={prepTime=>setPrepTime(prepTime)}></TextInput>
                        <Text style={styles.foodInfoSubTitle}>{language === 'vn' ? 'Chuẩn bị' : 'Prep'}</Text>
                        </View>
                        <View style={styles.foodInfoItem}>
                        <TextInput style={styles.foodInfoTitle} 
                        placeholder={language === 'vn' ? 'thời gian' : 'time'}
                        placeholderTextColor={theme==='light'?'#C7C7CD':'#A3A3A3'} 
                        value={cookingTime} onChangeText={cookingTime=>setCookingtime(cookingTime)}></TextInput>
                        <Text style={styles.foodInfoSubTitle}>{language === 'vn' ? 'Nấu' : 'Cooking'}</Text>
                        </View>     
                        <View style={styles.foodInfoItem}>
                        <Text style={[styles.foodInfoTitle, {marginVertical: 10}]}>{(totalCalories=='')? 0: totalCalories}</Text>
                        <Text style={styles.foodInfoSubTitle}>Cals/{language === 'vn' ? 'phần ăn' : 'serving'}</Text>
                        </View>                                                          
                    </View>              
                     
                     <View style={styles.split}/>
                     <View >
                     <Text style={[styles.PostTitle, {color: '#5AC30D'}]}>{language === 'vn' ? 'Cách làm' : 'Step'}</Text>
                     <TextInput multiline={true} style={[styles.PostText, {color: theme==='light'?"#000":"#fff"}]} 
                     placeholder={language === 'vn' ? 'Nhập cách làm' : 'Enter step'}
                     placeholderTextColor={theme==='light'?'#C7C7CD':'#A3A3A3'} 
                     value={receipt} onChangeText={receipt=>setReceipt(receipt)}></TextInput>
                     </View>
                     
                     <View style={styles.split}/>
                     <View >
                     <Text style={[styles.PostTitle, {color: '#CE3E3E'}]}>Ingredients</Text>
                     <TouchableOpacity style={{marginLeft:'auto', marginHorizontal: 15, marginBottom: 7}} onPress={()=>addIngredient()}>
                     <Icon name={'plus-circle'} size={30} color={'#0AD946'}/>
                     </TouchableOpacity>
                     
                     <View style={{backgroundColor: theme === 'light'? '#DBDBDB' : '#4E4E4E'}}>
                     {IngredientList?.map((item, index)=>{
                    return(  
                        

                          <TouchableOpacity onPress={()=> DeleteIngredient(index)} key={index}>
                            <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 15, marginVertical: 3, paddingBottom: 5, flex: 1}}>
                          <Image source = {{uri: item.image}} style={{width: 40,
           height: 40,
           resizeMode: 'stretch'}}/>
                         <Text style={{fontSize: 18, width: 200, marginStart: 3, color: theme==='light'?"#000":"#fff"}}>{item.name}</Text>
                         <View style={{marginLeft:'auto'}}>
                         <Text style={{marginLeft:'auto', fontSize: 16, color: "#2684fc"}}>{item.resultCalories}cals</Text>
                         <Text style={{marginLeft:'auto', fontSize: 16, color: "#2684fc"}}>{item.amount} {item.unit}</Text>
                         </View>
                         </View>
                            </TouchableOpacity>
                        
                      )}
                     )}
            </View>
            <View style={styles.split}/>
            <View style={{alignItems: 'center', backgroundColor: theme==='light'?'#DBDBDB' : '#4E4E4E', borderRadius: 13, marginHorizontal: 10, marginTop: 10}}>
            <View>
              {(image == null)?<Image source={{uri: imageTemp}} style={styles.image}/> : <Image source={{uri: image.path}} style={styles.image}/>}
            
              {(image==null)?null:<TouchableOpacity style={{position:'absolute', marginLeft: -15, marginTop: 5}} onPress={()=> setImage(null)}>
              <Image style={styles.icon} source={{uri: 'https://static.vecteezy.com/system/resources/previews/018/887/462/original/signs-close-icon-png.png'}}/>  
                
              </TouchableOpacity>}
            </View>       
            <Text style={{fontSize: 13, color: theme === 'light'? '#000' : '#fff'}}>{language === 'vn' ? 'Thêm hình ảnh' : 'Add image'}</Text>     
             <TouchableOpacity style={{marginTop: 10, marginBottom: 5, marginLeft: 'auto', marginRight: 10}} onPress={(event) => {
            setPopoverAnchor(event.nativeEvent.target);
            setPopoverVisible(true);
            }}>
          <Icon
              name={'images'}
              style={{
                
                color: 'green',
                fontSize: 30,
                alignSelf: 'center',
              }}
            /> 
          </TouchableOpacity>
          </View>
                     </View>
                </>    
            </ScrollView>
        </View>   
        <Popover
            isVisible={isPopoverVisible}
            onRequestClose={() => setPopoverVisible(false)}
            fromView={popoverAnchor}>
            <View style={styles.popover}>              
                <TouchableOpacity onPress={takePhotoFromCamera}>
                    <View style={styles.popoverItem}>
                        <Icon name="camera" size={35} color="black" />
                        <Text style={{ fontSize: 16, marginTop: 8, color: 'black' }}>Take photo</Text>
                    </View>
                </TouchableOpacity>           
                <TouchableOpacity onPress={pickImageAsync}>
                    <View style={styles.popoverItem}>
                        <Icon name="photo-video" size={35} color="black" />
                        <Text style={{ fontSize: 16, marginTop: 8, color: 'black' }}>Libraries</Text>
                    </View>
                </TouchableOpacity>
            </View>
      </Popover>  
    </View>
  )
            }
export default AddCustomRecipe;
            

const styles = StyleSheet.create({
  Container:{
      width: '100%',
      marginBottom: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
      padding: 5,
  },
  foodname:{
      fontSize: 30,
      textAlign: 'center',
  },
  headerContainer:{
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#DDD',
  },

  PostText:{
      fontSize: 16,
      paddingHorizontal: 15,
      marginBottom: 5,
      color:'black',
  },

  PostTitle:{
      fontSize: 18,
      fontFamily: 'Lato-Regular',
      paddingHorizontal: 15,
      fontWeight:"900",
      marginTop: 2,
  },

  split: {
      height: 1,
      backgroundColor: '#DDD',
      marginVertical: 10,
      marginHorizontal: 5
  },
  foodInfoWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 5,
  },
  foodInfoItem: {
    justifyContent: 'center',
    width: 105,
    paddingVertical: 2,
  },
  foodInfoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#E8B51A'
  },
  foodInfoSubTitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },

  text: {
    fontSize: 17
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
  icon: {
    width: 25,
    height: 25,
    
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 15,
    
  },
});