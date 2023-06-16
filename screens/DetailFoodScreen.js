import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Popover from 'react-native-popover-view';
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import LanguageContext from "../context/LanguageContext";

import ThemeContext from "../context/ThemeContext";
const DetailFoodScreen = ({route, navigation}) => {
  const {user} = useContext(AuthContext);
  const language = useContext(LanguageContext);
  //lưu dữ liệu đồ ăn
  const [unit, setUnit] = useState(route.params?.item.unit||"g");
  const [baseAmount, setBaseAmount] = useState(route.params?.item.baseAmount||'');
  const [calories, setCalories] = useState(route.params?.item.calories||'');
  const [image, setImage] = useState(null);
  const [name, setName] = useState(route.params?.item.name||'');
  const imageTemp = (route.params)? route.params?.item.image :'https://cdn-icons-png.flaticon.com/512/2927/2927347.png'
  const [id, setId] = useState(route.params?.item.id)//set route.params...vô trong const trước
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const theme = useContext(ThemeContext);
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
  const cancel = () => {
    navigation.goBack();
  }
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
  const checkInput = () => {
    Alert.alert("Input cannot be blank");
  }
  const saveCustomFood = async() => {
    
    try{
      
        const imageUrl = await uploadImage(image?.path);
        await firestore().collection('customFoods').add({
        userId:user.uid,
        name: name,
        image: imageUrl,
        calories: calories,
        baseAmount: baseAmount,
        unit: unit
        })
        
        console.log('custom food added');
        Alert.alert(
          'Add custom food succesfully!'
        );
        navigation.goBack();
      } 
      catch (error) {
        console.log('something went wrong!', error);
      }
  }
  const updateCustomFood = async() => {
    
    try{
        const imageUrl = await uploadImage(image?.path);
        await firestore().collection('customFoods').doc(id).update({
        name: name,
        image: imageUrl,
        calories: calories,
        baseAmount: baseAmount,
        unit: unit
        })
        
        console.log('custom food updated');
        Alert.alert(
          'Update custom food succesfully!'
        );
        navigation.goBack();
      } 
      catch (error) {
        console.log('something went wrong!', error);
      }
  }
  
  return (
    <View styles={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: theme === 'light' ?'#2AE371': '#7B7B7B'}}>
      <TouchableOpacity onPress={cancel}>
        <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Hủy' : 'Cancel'}</Text>
      </TouchableOpacity>
      <Text style={{fontSize: 23, color: '#fff', fontWeight: 'bold', marginHorizontal: 30}}>{language === 'vn' ? 'Chi tiết thức ăn' : 'Food detail'}</Text>
      {(id)?<TouchableOpacity onPress={(name==''||calories==''||baseAmount==''||unit=='')?checkInput:updateCustomFood}>
        <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Cập nhật' : 'Update'}</Text>
      </TouchableOpacity>: <TouchableOpacity onPress={(name==''||calories==''||baseAmount==''||unit=='')?checkInput:saveCustomFood}>
        <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Lưu' : 'Save'}</Text>
      </TouchableOpacity>}
      </View>
      <View style={{marginTop: 20}}>
      <TextInput style={styles.textInput} placeholder={language === 'vn' ? 'Nhập tên món ăn' : 'Enter food name'} value={name} onChangeText={name=>setName(name)}/>
      <TextInput style={styles.textInput} placeholder={language === 'vn' ? 'Nhập calories' : 'Enter calories'} value={calories} onChangeText={calories=>setCalories(calories)}/>
      <TextInput style={styles.textInput} placeholder={language === 'vn' ? 'Nhập khối lượng phần ăn' : 'Enter serving size'} value={baseAmount} onChangeText={baseAmount=>setBaseAmount(baseAmount)}/>
      <View style={{alignItems: 'center', flexDirection: 'row', marginStart: 20, borderColor: '#000', borderWidth: 1, borderRadius: 13, width: "90%"}}>
        <Text style={{fontSize: 17, marginStart: 3}}>{language === 'vn' ? 'Chọn đơn vị: ' : 'Choose unit:'}</Text>
      <Picker
        selectedValue={unit}
        style={{ width: 170 }}
        onValueChange={(itemValue, itemIndex) => setUnit(itemValue)}
      >
        <Picker.Item label="g" value="g" />
        <Picker.Item label="kg" value="kg" />
        <Picker.Item label="ml" value="ml" />
        <Picker.Item label="cup" value="cup" />
        <Picker.Item label="teaspoon" value="teaspoon" />
        <Picker.Item label="tablespoon" value="tablespoon" />
        <Picker.Item label="pieces" value="pieces" />
        <Picker.Item label="piece" value="piece" />
      </Picker>
      </View>
      <View style={{alignItems: 'center', marginStart: 20, borderColor: '#000', borderWidth: 1, borderRadius: 13, width: "90%", marginTop: 10}}>
      <View>
        
      {(image == null)?<Image source={{uri: imageTemp}} style={styles.image}/> : <Image source={{uri: image.path}} style={styles.image}/>}
                      
        {(image==null)?null:<TouchableOpacity style={{position:'absolute', marginLeft: -15, marginTop: 5}} onPress={()=> setImage(null)}>
          <Image style={styles.icon} source={{uri: 'https://static.vecteezy.com/system/resources/previews/018/887/462/original/signs-close-icon-png.png'}}></Image> 
          
        </TouchableOpacity>}
        </View>    
        <Text style={{fontSize: 13}}>{language === 'vn' ? 'Thêm hình ảnh' : 'Add image'}</Text>          
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontSize: 17
  },
    image: {
      width: 100,
      height: 100,
      marginTop: 15,
      
    },
    icon: {
      width: 25,
      height: 25,
      
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
    textInput: {
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 17,
      height: 60,
      width: "90%",
      alignSelf: 'center',
      marginBottom: 10
    },
    button: {
      marginTop: 15,
      borderRadius: 20,
      width: '40%',
      padding: 5,
      backgroundColor: '#2AE371',
      alignSelf: 'center'
  },

  });
export default DetailFoodScreen;