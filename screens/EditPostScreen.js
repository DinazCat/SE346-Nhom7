import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList, TouchableOpacity,Button,TextInput, Image, Alert, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AuthContext } from '../navigation/AuthProvider';
export default EditPostScreen= function({navigation, route}) {
    const [image,setimage] = useState(route.params.item.postImg);
    const [imageUrl,setimageUrl] = useState([]);
    const [FoodName, setFoodName] = useState(route.params.item.postFoodName);
    const [Ingredient, setIngredient] = useState(route.params.item.postFoodIngredient);
    const [Making, setMaking] = useState(route.params.item.postFoodMaking);
    const [Summary, setSummary] = useState(route.params.item.postFoodSummary);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [defaultRating, setdefaulRating] = useState(route.params.item.postFoodRating);
    const [maxRating, setmaxRating] = useState([1,2,3,4,5])
    const starImgFilled = "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
    const starImgCorner = "https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png";
    const {user} = useContext(AuthContext);
    const TextChangeFoodName = (Text)=>{setFoodName(Text)};
    const TextChangeIngredient = (Text)=>{setIngredient(Text)};
    const TextChangeMaking = (Text)=>{setMaking(Text)};
    const TextChangeSummary= (Text)=>{setSummary(Text)};

    const CustomRatingBar = () => {
      return (
        <View style={styles.customRatingBarStyle}>
          {
            maxRating.map((item, key)=>{
              return (
                <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={()=> setdefaulRating(item)}>
                  <Image style={styles.starImgStyle}
                  source={item <= defaultRating ? {uri: starImgFilled} : {uri:starImgCorner}}/>
                </TouchableOpacity>
              )
            })
          }
        </View>
      )
    }
    function allowPost()
    {
      if(image!=null || text !='')
      {
        return true;
      }
      return false;
    }
    const pickImageAsync = async () => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(img => {
        let image2 = image.slice();
        console.log(img.path);
        image2.push(img.path);
        setimage(image2);
      });
    };
    const SavePost=async()=>{
        await firestore()
        .collection('posts')
        .doc(route.params.item.postId)
        .update({
            postFoodIngredient:Ingredient,
            postFoodMaking:Making,
            postFoodName:FoodName,
            postFoodRating:defaultRating,
            postFoodSummary:Summary,
            postImg:imageUrl,
        })
        .then(() => {
          console.log('Post Updated!');
          Alert.alert(
            'Post Updated!',
            'Your Post has been updated successfully.'
          );
        })
    }
    const editPost = async() => {
    firestore().collection('posts')
    .doc(route.params.item.postId)
    .get()
    .then(documentSnapshot => {
      if(documentSnapshot.exists)
      {
        const {postImg} = documentSnapshot.data();
        if(postImg != null)
        {
          for(let i = 0; i<postImg.length; i++)
          {
            const storageRef = storage().refFromURL(postImg[i]);
            const imageRef = storage().ref(storageRef.fullPath);
            imageRef
            .delete()
            .then(()=>{ })
            .catch((e)=>{console.log('error when delete image '+e)})
          }
          
        }
      
      }
    })
      try {
        for(let i = 0; i < image.length; i++)
        {
          imageUrl[i] = await uploadImage(image[i]);
          if(i == image.length-1) SavePost();
        }
    }
      catch (error) {
        console.log('something went wrong!', error);
      }
    }
    
    const uploadImage = async (image)=>{
      if(image == null) return null;
      if(image.includes('https')) return image;
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1);
        const extension = filename.split('.').pop();
         const name = filename.split('.').slice(0,-1).join('.');
         filename = name + Date.now() + '.' + extension;
       // console.log(filename);
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
        setimage(null);

    }
      
    return (
      <View style={styles.container}>
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFF99',
          }}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Icon name={'arrow-left'} style={{color: 'black', fontSize: 30, padding: 5}} />
          </TouchableOpacity>

          <Text style={{fontSize: 20, flex: 1, marginLeft: 5}}>
            Sửa bài viết
          </Text>
          {uploading ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text>{transferred} % completed! </Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <Button
              title={'Lưu'}
              color={allowPost() == true ? '#FFCC00' : '#BBBBBB'}
              onPress={editPost}
            />
          )}
          <View style={{marginRight: 5}} />
        </View>
        <View
          style={{
            height: 70,
            flexDirection: 'row',
          }}>
          <Image
            source={{uri: user.photoURL}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 30,
              marginLeft: 10,
              backgroundColor: 'black',
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: '700',
              alignSelf: 'center',
            }}>
            {user.displayName}
          </Text>
        </View>
        {selectedTab == 0 ? (
          <>
           <View style={styles.TextBox}>
           <Icon name={"pencil-alt"} style={{ color: "#FFCC00", fontSize: 30, marginLeft:340,position:"absolute" }} />
           <ScrollView>
             <Text style={styles.TextStyle}>Tên món ăn</Text>
           <TextInput
             multiline={true}
             style={{fontSize: 16, marginLeft: 3}}
             value={FoodName}
             onChangeText={TextChangeFoodName}
           />
           <View style={{height:1, width:'90%', backgroundColor: 'black', alignSelf:"center"}}/>
            <Text style={styles.TextStyle}>Độ khó</Text>
            <CustomRatingBar/>
            <Text style={styles.TextStyle}>Nguyên liệu</Text>
           <TextInput
             multiline={true}
             value={Ingredient}
             style={{fontSize: 16, marginLeft: 3}}
             onChangeText={TextChangeIngredient}
           />
            <View style={{height:1, width:'90%', backgroundColor: 'black', alignSelf:"center"}}/>
           <Text style={styles.TextStyle}>Cách làm</Text>
           <TextInput
             multiline={true}
             value={Making}
             style={{fontSize: 16, marginLeft: 3}}
             onChangeText={TextChangeMaking}
           />
            <View style={{height:1, width:'90%', backgroundColor: 'black', alignSelf:"center"}}/>
           <Text style={styles.TextStyle}>Tổng kết</Text>
           <TextInput
             multiline={true}
             value={Summary}
             style={{fontSize: 16, marginLeft: 3}}
             onChangeText={TextChangeSummary}
           />
            <View style={{height:1, width:'90%', backgroundColor: 'black', alignSelf:"center"}}/>
           </ScrollView>
 
           </View>  
           </>  
        ) : (
          <View style={{height: 545, flexDirection: 'column'}}>
         
          
          
          {image.length==0? (
            <View>
              <Image
                source={require('../assets/MonAn.jpg')}
                style={{
                  width: 300,
                  height: 200,
                  borderRadius: 15,
                  alignSelf: 'center',
                  marginTop: 150,
                }}
              />
              <Text style={{alignSelf: 'center'}}>
                Thêm hình ảnh mà bạn thích
              </Text>
            </View>
          ) : null}
          <ScrollView style={{flexDirection:'column', }}>
            {
              image.map((each,key)=>{
                return(  
                    <View key={key}>
                      <Image source={{uri:each}} style={{height:200, width:400, marginTop:5}} resizeMode='cover'/>
                      <TouchableOpacity style={{ marginTop:3, position:'absolute'}} onPress={()=>{
                        let filterRssult=image.filter(function(element){
                          return element !== each;
                        })
                        setimage(filterRssult);
                       }}>
                       <Icon name={"backspace"} style={{ color: "#FFCC00", fontSize: 25 }} />
                     </TouchableOpacity>
                    </View>     
                );
              })
             
            }
  
          </ScrollView>
          <TouchableOpacity onPress={pickImageAsync}>
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
        )} 
       
        <View style={styles.Wrapper}>
          <TouchableOpacity
            style={{
              height: 42,
              flexDirection: 'row',
            }}
            onPress={() => {setSelectedTab(0)}}>
            <View style={{justifyContent: 'center',backgroundColor: selectedTab == 0 ? '#f545' : '#FFCC00'}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}>
              Bài viết
            </Text>
            </View>
            
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 42,
              flexDirection: 'row',
            }}
            // onPress={pickImageAsync}
            onPress={() => {setSelectedTab(1)}}>
            <View style={{justifyContent: 'center',backgroundColor: selectedTab == 1 ? '#f545' : '#FFCC00'}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}>
              Thêm ảnh
            </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: '#fff',
    },
    TextBox:{
      height:545,
      width:"95%", 
      borderColor:"black", 
      borderWidth:1, 
      borderRadius:20, 
      marginLeft:10,
    },
    TextStyle:
    {
      fontSize: 18, 
      marginLeft: 6,
      marginTop:20,
      color:"black",
      fontWeight:"600"

    },
    Wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems:'center',
      width: '100%',
      marginTop: 10,
      backgroundColor: '#FFCC00'
    },
    customRatingBarStyle:{
      flexDirection:"row",
      marginLeft:6,
      marginTop:5
    },
    starImgStyle:{
      width:30,
      height:30,
      resizeMode:'cover'
    }

  })
  