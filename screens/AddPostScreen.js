import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList, TouchableOpacity,Button,TextInput, Image, Alert, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AuthContext } from '../navigation/AuthProvider';
export default AddPostScreen= function({navigation}) {
    const [image,setimage] = useState([]);
    const [imageUrl,setimageUrl] = useState([]);
    const [text, setText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const {user} = useContext(AuthContext);
    const TextChange = (Text)=>{setText(Text)};
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
        image2.push(img);
        setimage(image2);
      });
    };
    const submitPost = async() => {
      try {
        for(let i = 0; i < image.length; i++)
        {
          imageUrl[i] = await uploadImage(image[i].path);
        }
       // const imageUrl = await uploadImage();
        const docRef = await firestore().collection('posts').add({
          postId: null,
          userId: user.uid,
          post: text,
          postImg: imageUrl,
          postTime: firestore.Timestamp.fromDate(new Date()),
          likes: [],
          comments: [],
          name: user.displayName,
          userImg: user.photoURL,
        });
        await firestore().collection('posts').doc(docRef.id).update({
          postId: docRef.id
        });
        console.log('post added');
        Alert.alert(
          'Post uploaded',
          'Your post has been upload to the Firebase Cloud Storage successfully!'
        );
        navigation.push('feedsScreen');
        setText('');
      } catch (error) {
        console.log('something went wrong!', error);
      }
    }
    
    const uploadImage = async (image)=>{
      if(image == null) return null;
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
            // marginTop: 50,
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFF99',
          }}>
          <TouchableOpacity onPress={()=> navigation.navigate('feedsScreen')}>
            <Icon name={'arrow-left'} style={{color: 'black', fontSize: 30, padding: 5}} />
          </TouchableOpacity>

          <Text style={{fontSize: 20, flex: 1, marginLeft: 5}}>
            Tạo bài viết
          </Text>
          {uploading ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text>{transferred} % completed! </Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <Button
              title={'Đăng'}
              color={allowPost() == true ? '#FFCC00' : '#BBBBBB'}
              onPress={submitPost}
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
        <View style={{height: 545, flexDirection: 'column'}}>
          <TextInput
            placeholder="Bạn đang nghĩ gì?"
            multiline={true}
            style={{fontSize: 16, marginLeft: 3}}
            placeholderTextColor={'rgba(0,0,0,0.8)'}
            onChangeText={TextChange}
          />
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
          <ScrollView style={{flexDirection:'column', marginTop:70}}>
            {
              image.map(each=>{
                return(  
                    <View >
                      <Image source={{uri:each.path}} style={{height:200, width:400, marginTop:5}} resizeMode='cover'/>
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
         {/* {image!=null? <Image
            source={{uri: image}}
            style={{height: 300, width: 400, marginTop: 70}}
            resizeMode="contain"
          />:null} */}
        </View>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            style={{
              height: 42,
              flexDirection: 'row',
              backgroundColor: '#FFCC00',
            }}
            onPress={pickImageAsync}>
            <Icon
              name={'images'}
              style={{
                marginLeft: 4,
                color: 'green',
                fontSize: 30,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                marginLeft: 10,
                alignSelf: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}>
              +Thêm ảnh
            </Text>
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
  })
  