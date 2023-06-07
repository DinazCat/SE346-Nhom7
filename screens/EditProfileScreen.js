import { StyleSheet, Text, View, TouchableOpacity,ImageBackground, TextInput, Alert} from 'react-native'
import React, {useEffect, useContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FormButton from '../components/FormButton';

import { requestCameraPermission, requestStoragePermission } from '../utils/Permission';
const EditProfileScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const language = useContext(LanguageContext);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {

    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  const handleUpdate = async() => {
    let imgUrl = await uploadImage();
    if( imgUrl == null && userData.userImg ) {
      imgUrl = userData.userImg;
    }
    
    try{
      await firestore()
      .collection('users')
      .doc(user.uid)
      .update({
      name: userData.name,
      about: userData.about,
      email: userData.email,
      userImg: imgUrl,
      })
      .then(() => {
        console.log('User Updated!');
        Alert.alert(
          'Profile Updated!',
          'Your Profile has been updated successfully.'
        );
      });
    } catch(e){
      console.log(e);
    };
    
    auth().currentUser.updateProfile({
      displayName: userData.name,
      photoURL: imgUrl
    })
    .catch((error) => {
      console.log('Error updating displayName:', error);
    });

    try{
      //update username and userimg in posts
      const postsRef = firestore().collection('posts');
      const querySnapshot = await postsRef.where('userId', '==', user.uid).get();
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        const postRef = postsRef.doc(doc.id);
        const updatedPostData = {
          ...postData,
          userImg: imgUrl,
          name: userData.name,
        };
        doc.ref.update(updatedPostData);
      });  
      // update username and userimg in comments  
      const querySnapshot2 = await postsRef.get();
      querySnapshot2.forEach((doc) => {
        const postRef = postsRef.doc(doc.id);
        const comments = doc.data().comments || [];
    
        // Cập nhật thông tin userimg và username mới trong mảng "comments"
        const updatedComments = comments.map((comment) => {
          if (comment.userId === user.uid) {
            return {
              ...comment,
              profile: imgUrl,
              name: userData.name,
            };
          }
          return comment;
        });
    
        // Cập nhật mảng "comments" trong document
        postRef.update({ comments: updatedComments });
      });
    } catch(e){
      console.log(e);
    };

    setImage(imgUrl)
  };

  const uploadImage = async () => {
    if( image == null ) return null;
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();
      setUploading(false);
      setImage(null);
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const takePhotoFromCamera = () => {
    requestCameraPermission()
    .then(() => {
      ImagePicker.openCamera({
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        cropping: true,
        compressImageQuality: 0.7,
      }).then((image) => {
        setImage(image.path);
        this.sheetRef.current.snapTo(1);
      });
    });  
  };

  const choosePhotoFromLibrary = () => {
    requestStoragePermission()
    .then(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.7,
      }).then((image) => {
        console.log(image);
        setImage(image.path);
        this.sheetRef.current.snapTo(1);
      });
    });    
  };
  renderContent = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.sheetRef.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  sheetRef = React.createRef();
  fall = new Animated.Value(1);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={this.sheetRef}
        snapPoints={[370, 0]}
        renderContent={this.renderContent}
        renderHeader={this.renderHeader}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.sheetRef.current.snapTo(0)}>
            <View>
              <ImageBackground
                source={{
                  uri: image ? image : userData? userData.userImg? userData.userImg:
                      'https://cdn-icons-png.flaticon.com/512/1144/1144811.png':
                      'https://cdn-icons-png.flaticon.com/512/1144/1144811.png'        
                }}
                style={{height: 100, width: 100}}
                imageStyle={{borderRadius: 50}}>
                <View
                  style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={35}
                    color="#fff"
                    style={styles.cameraIcon}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
            {userData ? userData.name : user ? user.displayName : ''}
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color="#333333" size={20} />
          <TextInput
            placeholder={language === 'vn' ? 'Tên' : 'Name'}
            placeholderTextColor="#666666"
            value={userData ? userData.name : ''}
            onChangeText={(txt) => setUserData({...userData, name: txt})}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <Ionicons name="ios-clipboard-outline" color="#333333" size={20} />
          <TextInput
            multiline
            numberOfLines={3}
            placeholder={language === 'vn' ? 'Tiểu sử' : 'About Me'}
            placeholderTextColor="#666666"
            value={userData ? userData.about : ''}
            onChangeText={(txt) => setUserData({...userData, about: txt})}
            autoCorrect={true}
            style={[styles.textInput, {height: 40}]}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" color="#333333" size={19} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666666"
            keyboardType='email-address'
            value={userData ? userData.email : ''}
            onChangeText={(txt) => setUserData({...userData, email: txt})}
            autoCorrect={false}
            style={[styles.textInput, {height: 40}]}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color="#333333" size={20} />
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            value={userData ? userData.phone : ''}
            onChangeText={(txt) => setUserData({...userData, phone: txt})}
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name="globe" color="#333333" size={21} />
          <TextInput
            placeholder="Country"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.country : ''}
            onChangeText={(txt) => setUserData({...userData, country: txt})}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            color="#333333"
            size={24}
          />
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.city : ''}
            onChangeText={(txt) => setUserData({...userData, city: txt})}
            style={styles.textInput}
          />
        </View>
        <FormButton title={language === 'vn' ? 'Cập nhật' : 'Update'} onPress={handleUpdate}/>
      </Animated.View>
    </View>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    cameraIcon: {
        opacity: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 3,
        alignItems: 'center'
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput:{
        color: '#333333',
        paddingLeft: 10
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
      width: '100%',
      marginLeft: 20
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -3},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,

    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
      marginLeft: 40
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
      color: '#333'
    },
    panelSubtitle: {
      fontSize: 14,
      color: '#555',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: '#66cc00',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: '#222',
    },
})