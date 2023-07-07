import { StyleSheet, Text, View, TouchableOpacity,ImageBackground, TextInput, Alert, Image, ScrollView} from 'react-native'
import React, {useEffect, useContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FormButton from '../components/FormButton';
import { Picker } from '@react-native-picker/picker';
import { requestCameraPermission, requestStoragePermission } from '../utils/Permission';
const EditProfileScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState();
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  useEffect(() => {
    getHeightWeightAge();
    getUserData();
  }, []);
  const CaloriesNeedToBurn = (age, height, weight, activityLevel, goal, sex, weeklyGoal)=>{
    let bmr = 0;
    if (sex == 'Male'){
      bmr = 10 * parseInt(weight) + 6.25 * parseInt(height) - 5 * parseInt(age) + 5;
    }
    else {
      bmr = 10 * parseInt(weight) + 6.25 * parseInt(height) - 5 * parseInt(age) - 161;
    }
    switch (activityLevel){
      case "Not very active":
        bmr = (bmr * 1.2).toFixed();
        break;
      case "Lightly active":
        bmr = (bmr * 1.375).toFixed();
        break;
      case "Moderate":
        bmr = (bmr * 1.55).toFixed();
        break;
      case "Active":
        bmr = (bmr * 1.725).toFixed();
        break;
      case "Very active":
        bmr = (bmr * 1.9).toFixed();
        break;
    }
    switch (weeklyGoal){
      case "0.25":
          if (goal == "Lose weight"){
            bmr -= 250;
          }
          else {
            bmr = parseInt(bmr) + 250;
          }
          break;
      case "0.5":
          if (goal == "Lose weight"){
            bmr -= 500;
          }
          else {
            bmr = parseInt(bmr) + 500;
          }
          break;
      case "1":
          if (goal == "Lose weight"){
            bmr -= 1000;
          }
          else {
            bmr = parseInt(bmr) + 1000;
          }
          break;
  }
    return bmr;
  }

  const getHeightWeightAge = () => {
    firestore()
    .collection('bmi')
    .doc(user.uid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        setHeight(documentSnapshot.data().height);
        setWeight(documentSnapshot.data().weight);
        setAge(documentSnapshot.data().age);
        setSex(documentSnapshot.data().sex)
      }
    });
  }
  

const updateHeightWeightAgeDiary = async () => {
  
  return new Promise((resolve, reject) => {
  const unsubscribe = firestore()
  .collection('bmiDiary')
  .where('userId', '==', user.uid)
  .onSnapshot((querySnapshot)=>{
    let arr = [];
    querySnapshot.forEach(doc =>{
      const {time, activityLevel, goal, sex, weeklyGoal} = doc.data();
      arr.push({time: time, id: doc.id, activityLevel: activityLevel, goal: goal, sex: sex, weeklyGoal: weeklyGoal})
      
    })
    let arrSort = arr.sort((a,b)=>a.time - b.time);
    let item = arrSort[arrSort.length - 1];
      resolve(item);
    },
    (error) => {
      console.log(error);
      reject([]);
    }
  );
  return () => unsubscribe();
});
};

const updateBmr = async() => {
  const item = await updateHeightWeightAgeDiary();
  
    firestore().collection('bmiDiary').add({
      bmr: CaloriesNeedToBurn(age, height, weight, item.activityLevel, item.goal, sex, item.weeklyGoal),
      userId: user.uid,
      age: age,
      height: height,
      weight: weight,
      sex: sex,
      goal: item.goal,
      weeklyGoal: item.weeklyGoal,
      activityLevel: item.activityLevel,
      time: firestore.Timestamp.fromDate(new Date()),
    });
  

}
const checkInput = () => {
  Alert.alert('Input cannot be blank')
}
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
      await firestore().collection('bmi').doc(user.uid).update({
        height: height,
        weight: weight,
        age: age,
        sex: sex
      }
      )
      await updateBmr();
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
    <View style={[styles.panel, {marginLeft:15, backgroundColor: theme === 'light'? '#EAEAEA' : '#4E4E4E'}]}>
      <View style={{alignItems: 'center'}}>
        <Text style={[styles.panelTitle, {color: theme === 'light'? '#000' : '#fff'}]}>Upload Photo</Text>
        <Text style={[styles.panelSubtitle, {color: theme === 'light'? '#000' : '#fff'}]}>Choose Your Profile Picture</Text>
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
    <View style={[styles.header, {marginLeft:15, backgroundColor: theme === 'light'? '#EAEAEA' : '#838383'}]}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  sheetRef = React.createRef();
  fall = new Animated.Value(1);

  return (
    <View style={[styles.container, {backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}]}>
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
          margin: 10,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons 
                name="arrow-back"
                size={28}
                backgroundColor='transparent'
                color={theme === 'light'? '#000' : '#fff'}                          
                />
        </TouchableOpacity>     
      </View>
      <ScrollView style={{marginBottom: 40}}>
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
          <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold', color: theme==='light'?'#000':'#fff'}}>
            {userData ? userData.name : user ? user.displayName : ''}
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color={theme==='light'?'#000':'#fff'} size={20} />
          <TextInput
            placeholder={language === 'vn' ? 'Tên' : 'Name'}
            placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
            value={userData ? userData.name : ''}
            onChangeText={(txt) => setUserData({...userData, name: txt})}
            autoCorrect={false}
            style={[styles.textInput, {color: theme==='light'?'#000':'#fff'}]}
          />
        </View>
        <View style={styles.action}>
          <Ionicons name="ios-clipboard-outline" color={theme==='light'?'#000':'#fff'} size={20} />
          <TextInput
            multiline
            numberOfLines={3}
            placeholder={language === 'vn' ? 'Tiểu sử' : 'About Me'}
            placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
            value={userData ? userData.about : ''}
            onChangeText={(txt) => setUserData({...userData, about: txt})}
            autoCorrect={true}
            style={[styles.textInput, {height: 40, color: theme==='light'?'#000':'#fff'}]}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" color={theme==='light'?'#000':'#fff'} size={19} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
            keyboardType='email-address'
            value={userData ? userData.email : ''}
            onChangeText={(txt) => setUserData({...userData, email: txt})}
            autoCorrect={false}
            style={[styles.textInput, {height: 40, color: theme==='light'?'#000':'#fff'}]}
          />
        </View>
        

        <View style={[styles.action, {height:60}]}>
          <FontAwesome name="intersex" color={theme==='light'?'#000':'#fff'} size={25} />
          {sex?<Picker
        selectedValue={sex}
        dropdownIconColor = {theme === 'light'? '#000':'#fff'}
        style={{width: 210, alignSelf: 'center', color: theme === 'light'? '#000' : '#fff'}}
        onValueChange={(itemValue, itemIndex) => setSex(itemValue)}
        
      >
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Male" value="Male" />
      </Picker>:null}
        </View>
        <View style={styles.action}>
          <Image
            source={{uri: 'https://cdn-icons-png.flaticon.com/512/5541/5541575.png'}}
            style={{width: 25, height: 25}}
          />
          <TextInput
            placeholder={language==='vn'?'Tuổi':'Age'}
            keyboardType = 'number-pad'
            placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
            autoCorrect={false}
            value={age}
            onChangeText={age => {if(parseInt(age)>0||age=='') setAge(age.replace(/[^0-9]/g, ''))}} 
            style={[styles.textInput, {color: theme==='light'?'#000':'#fff'}]}
          />
        </View>

        <View style={styles.action}>
        <MaterialCommunityIcons name="scale-bathroom" color={theme==='light'?'#000':'#fff'} size={20} />
          <TextInput
            placeholder={language==='vn'?'Cân nặng':'Weight'}
            placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
            keyboardType="number-pad"
            autoCorrect={false}
            onChangeText={weight => {if(parseInt(weight)>0||weight=='') setWeight(weight.replace(/[^0-9]/g, ''))}} value={weight}
            style={[styles.textInput, {color: theme==='light'?'#000':'#fff'}]}
          />
        </View>

        <View style={styles.action}>
          <MaterialCommunityIcons name="human-male-height" color={theme==='light'?'#000':'#fff'} size={25} />
          <TextInput
            placeholder={language==='vn'?'Chiều cao':'Height'}
            keyboardType = 'number-pad'
            placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
            autoCorrect={false}
            onChangeText={height => {if(parseInt(height)>0||height=='') setHeight(height.replace(/[^0-9]/g, ''))}} value={height}
            style={[styles.textInput, {color: theme==='light'?'#000':'#fff'}]}
          />
        </View>

        {(height==''||weight==''||age=='')?<FormButton title={language === 'vn' ? 'Cập nhật' : 'Update'} onPress={checkInput}/>:<FormButton title={language === 'vn' ? 'Cập nhật' : 'Update'} onPress={handleUpdate}/>}
        </ScrollView>

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
      marginRight: 15
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: '#222',
    },
    headerContainer:{
      flexDirection: 'row',
      paddingBottom: 8,
      marginBottom: 10,
  },
})