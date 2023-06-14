import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, ScrollView, Alert, ActivityIndicator} from "react-native";
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


const AddCustomRecipe = ({route}) => {
  const {user} = useContext(AuthContext)
  const dispatch = useDispatch();
  const IngredientList= useSelector((state) => state.IngredientList.value);
  const totalCalories = useSelector((state) => state.IngredientList.totalCalories);
  const isEdit = useSelector((state) => state.IngredientList.isEdit);
  const imageTemp = (route.params)? route.params?.item.image :'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg'
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
      navigation.navigate('AddScreen')
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
        navigation.navigate('AddScreen')
      } 
      catch (error) {
        console.log('something went wrong!', error);
      }
  }

  // add image
  return (
    <View style={styles.Container}>
    
     {isEdit?<TouchableOpacity onPress={(IngredientList.length == 0||name=='')?checkNameAndIngredient:updateRecipe}>
      <Text>{language === 'vn' ? 'Cập nhật' : 'Update'}</Text>
     </TouchableOpacity> :
     <TouchableOpacity onPress={(IngredientList.length == 0||name=='')?checkNameAndIngredient:saveRecipe}>
        <Text>{language === 'vn' ? 'Cập nhật' : 'Update'}</Text>
     </TouchableOpacity> }
            <View style={styles.headerContainer}>
            <TextInput style={styles.foodname} value={name} onChangeText={name=>setName(name)}></TextInput>
            </View>
            
        <View style={[styles.Container,{height:650}]}>
            <ScrollView style={{flexDirection:'column'}}>               
                    <>
                    <View style={styles.foodInfoWrapper}>
                        <View style={styles.foodInfoItem}>
                        <TextInput style={styles.foodInfoTitle} value={prepTime} onChangeText={prepTime=>setPrepTime(prepTime)}></TextInput>
                        <Text style={styles.foodInfoSubTitle}>Prep</Text>
                        </View>
                        <View style={styles.foodInfoItem}>
                        <TextInput style={styles.foodInfoTitle} value={cookingTime} onChangeText={cookingTime=>setCookingtime(cookingTime)}></TextInput>
                        <Text style={styles.foodInfoSubTitle}>Cooking</Text>
                        </View>     
                        <View style={styles.foodInfoItem}>
                        <Text>{totalCalories}</Text>
                        <Text style={styles.foodInfoSubTitle}>Cal/serving</Text>
                        </View>                                                          
                    </View>              
                     
                     <View style={styles.split}/>
                     <View style={{backgroundColor:'#F5F5F5'}}>
                     <Text style={[styles.PostTitle, {color: '#CE3E3E'}]}>Steps</Text>
                     <TextInput multiline={true} style={styles.PostText} value={receipt} onChangeText={receipt=>setReceipt(receipt)}></TextInput>
                     </View>
                     

                     <View style={styles.split}/>
                     <View style={{backgroundColor:'#F5F5F5'}}>
                     <Text style={[styles.PostTitle, {color: '#5AC30D'}]}>Ingredients</Text>
                     <TouchableOpacity onPress={()=>addIngredient()}>
                      <Text>{language === 'vn' ? 'Thêm' : 'Add'}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={()=>deleteAll()}>
                      <Text>Delete All</Text>
                     </TouchableOpacity>
                     {IngredientList?.map((item, index)=>{
                    return(  
                        <View key={index}>

                          <TouchableOpacity onPress={()=> DeleteIngredient(index)}>
                            {item.image?<Image source={{uri: item.image}} style={styles.tabIcon}/>:<Image source={{uri: imageTemp}} style={styles.tabIcon}/>}
                            <Text>{item.name}</Text>
                            <Text>{item.resultCalories}</Text>
                            <Text>{item.amount}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                     )}
                     
                      {(image == null)?<Image source={{uri: imageTemp}} style={styles.tabIcon}/> : <Image source={{uri: image.path}} style={styles.tabIcon}/>}
                      
                      {(image==null)?null:<TouchableOpacity onPress={()=> setImage(null)}>
                        <Image style={styles.tabIcon} source={{uri: 'https://www.uidownload.com/files/240/295/614/delete-icon.jpg'}}></Image> 
                        
                      </TouchableOpacity>}
                      
                      <TouchableOpacity onPress={(event) => {
            setPopoverAnchor(event.nativeEvent.target);
            setPopoverVisible(true);
            }}>
          <Icon
              name={'images'}
              style={{
                marginLeft: 300,
                color: 'green',
                fontSize: 50,
                alignSelf: 'center',
              }}
            /> 
          </TouchableOpacity>
                     </View>
                </>
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
            </ScrollView>
        </View>   
        
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
        fontSize: 45,
        textAlign: 'center',
        color: '#000',
        fontFamily: 'WishShore',
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
        marginBottom: 10,
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
        width: '100%',
        marginVertical: 15,
      },
      foodInfoItem: {
        justifyContent: 'center',
        width: 100,
        borderRadius: 5,
        paddingVertical: 2,
      },
      foodInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: '#E8B51A'
      },
      foodInfoSubTitle: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
      },
     
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
        
  });