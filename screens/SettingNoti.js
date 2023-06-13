import React, {useContext, useEffect, useState} from "react";
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,Image, ActivityIndicator} from 'react-native';
import { AuthContext } from '../navigation/AuthProvider'
import TabContainer from "../components/TabContainer"
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import LanguageContext from "../context/LanguageContext";
import CheckBox from '@react-native-community/checkbox'

const SettingNoti = ({navigation}) => {
    const language = useContext(LanguageContext);
    const [isChecked1, setCheck1] = useState(false);
    const [isChecked2, setCheck2] = useState(false);
    const [isChecked3, setCheck3] = useState(false);
    const [isChecked4, setCheck4] = useState(false);
    const collectionRef = firestore().collection('NotificationSetting');
    const toggleCheckBox1 = () => {
        let x = !isChecked1
        setCheck1(x); 
        const documentData = {
          follow: x,
          like : isChecked2,
          comment: isChecked3,
          post: isChecked4,
        };
        collectionRef
          .doc(auth().currentUser.uid)
          .set(documentData)
      };
     const toggleCheckBox2 = () => {
      let x = !isChecked2
        setCheck2(x); 
       // console.log(isChecked2);
        const documentData = {
          follow: isChecked1,
          like : x,
          comment: isChecked3,
          post: isChecked4,
        };
        collectionRef
          .doc(auth().currentUser.uid)
          .set(documentData)
      };
    const toggleCheckBox3 = () => {
      let x = !isChecked3
        setCheck3(x); 
        //console.log(isChecked3);
        const documentData = {
          follow: isChecked1,
          like : isChecked2,
          comment: x,
          post: isChecked4,
        };
        collectionRef
          .doc(auth().currentUser.uid)
          .set(documentData)
      };
     const toggleCheckBox4 = () => {
      let x = !isChecked4
        setCheck4(x); 
        //console.log(isChecked4);
        const documentData = {
          follow: isChecked1,
          like : isChecked2,
          comment: isChecked3,
          post: x,
        };
        collectionRef
          .doc(auth().currentUser.uid)
          .set(documentData)
      };
      const docNotiSetting = () => {
        firestore().collection('NotificationSetting').doc(auth().currentUser.uid)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      try{
        setCheck1(data.follow);
      }
      catch{
        setCheck1(false);
      }
      
      try{
        setCheck2(data.like);
      }
      catch{
        setCheck2(false);
      }
      try{
        setCheck3(data.comment);
      }
      catch{
        setCheck3(false);
      }
      try{
        setCheck4(data.post);
      }
      catch{
        setCheck4(false);
      }

    } else {
      setCheck1(false);
      setCheck2(false);
      setCheck3(false);
      setCheck3(false);
    }
  })
  .catch((error) => {
    console.error('Lỗi khi đọc document:', error);
  });
      }
      useEffect(()=>
      {
        docNotiSetting();
      },[])
    return (
      <View style={styles.container}>
        <View style={{height: 50, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => { navigation.goBack();
            }}>
            <Icon
              name={'arrow-left'}
              style={{color: 'black', fontSize: 30, padding: 5}}
            />
          </TouchableOpacity>
          <Text style={styles.textfont}>
          {language === 'vn' ?"Cài đặt thông báo":"Notification Setting"}
          </Text>
        </View>
        <Text style={[styles.textfont,{marginTop:20}]}>{language === 'vn' ?"Gửi tôi thông báo khi: ":"Send me a push notification when:"}</Text>
        <View style={styles.row}>
            <Text style={[styles.textfont,{width:"90%"}]}> {language === 'vn' ?"Ai đó bắt đầu theo dõi tôi":"Someone starts following me"}</Text>    
            <CheckBox
        value={isChecked1} 
        onValueChange={toggleCheckBox1} 
      />     
        </View>
        <View style={styles.row}>
            <Text style={[styles.textfont,{width:"90%"}]}> {language === 'vn' ?"Ai đó thích bài viết của tôi":"Someone likes my post"}</Text>    
            <CheckBox
        value={isChecked2} 
        onValueChange={toggleCheckBox2}
      />     
        </View>
        <View style={styles.row}>
            <Text style={[styles.textfont,{width:"90%"}]}> {language === 'vn' ?"Ai đó bình luận bài viết của tôi":"Someone comments on my post"}</Text>    
            <CheckBox
        value={isChecked3} 
        onValueChange={toggleCheckBox3}
      />     
        </View>
        <View style={styles.row}>
            <Text style={[styles.textfont,{width:"90%"}]}> {language === 'vn' ?"Người mà tôi theo dõi đăng bài viết mới":"Someone I'm following posts a new post"}</Text>    
            <CheckBox
        value={isChecked4} 
        onValueChange={toggleCheckBox4}
      />     
        </View>
        {/* <View style={{flex:1, justifyContent:'flex-end'}}/> */}
        <View style={{ marginVertical:250}}>
          <Text style={{marginLeft:5}}>
          {language !== 'vn' ? "Turning push notifications off will prevent you from seeing theses update on your look screen. Howerver, you will still receive these notifications in app. "
          :"Tắt thông báo sẽ ngăn bạn nhìn thấy thông báo trên màn hình khóa của mình. Tuy nhiên, bạn vẫn sẽ nhận được những thông báo này trong ứng dụng."}
          </Text>
        </View>

        
      </View>
    );
}
export default SettingNoti;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection:'column',
      backgroundColor:'#fff'
    },
    textfont:{
      fontSize: 20,
      marginLeft: 5, 
      color: 'black'
    },
    row:
    {
      height:50, 
      backgroundColor:'#FFFAF0',
      flexDirection:'row',
      marginTop:10,
      alignItems:'center'
    }
   
})