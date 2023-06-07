import { StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput, ScrollView } from 'react-native'
import React, {useEffect, useContext, useState, useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import NotificationForm from '../components/NotificationForm';
import LanguageContext from "../context/LanguageContext";

const NotificationScreen = ({navigation}) => {
  const [noread, setnoread] = useState([]);
  const [read, setread] = useState([]);
  const language = useContext(LanguageContext);

  const getNotification = async () => {  
   firestore()
    .collection('Notification')
    .orderBy('time', 'desc')
    .onSnapshot((querySnapshot)=>{
      let listNo =[];
      let listYes = [];
      querySnapshot.forEach(doc =>{
      const {PostownerId, Read, classify, guestId, guestImg, guestName, postid, text, time,} = doc.data();
      var Time = new Date(time._seconds * 1000).toDateString() + ' at ' + new Date(time._seconds * 1000).toLocaleTimeString();
      if(PostownerId == auth().currentUser.uid)
      {
        if(Read == 'no')
        {
          listNo.push({
            Messid:doc.id,
            GName : guestName,
            GId : guestId,
            GImg : guestImg,
            Class : classify,
            PostId: postid,
            Mess: text,
            Time:Time,
        })
        }
        else{
          listYes.push({
            Messid:doc.id,
            GName : guestName,
            GId : guestId,
            GImg : guestImg,
            Class : classify,
            PostId: postid,
            Mess: text,
            Time:Time,
        })
        }
      }

      });
      setnoread(listNo);
      setread(listYes);
      //console.log("thay");

    })

  }
  useEffect(()=>{
    getNotification();
  },[])
  const setMark = () =>
  {
    if(noread.length > 0)
    for(let i = 0; i < noread.length; i++)
    {
      firestore()
      .collection('Notification')
      .doc(noread[i].Messid)
      .update({
        Read:'yes',
      })
      .then(() => {
      })
      .catch(error => {
        console.log('Error deleting comment: ', error);
      });

    }
   
  }
  const Action = (item) =>{
    if(item.Class == 'Follow')
    {
      navigation.push('profileScreen', {userId: item.GId})
    }
    else
    {
      navigation.push('gotoPost',{postid:item.PostId})
    }
}
    return(
        <View style={styles.container}>
            <View style={{height:50, flexDirection:'row', alignItems:'center'}}>
            <TouchableOpacity onPress={()=> {setMark(),navigation.goBack()}}>
            <Icon name={'arrow-left'} style={{color: 'black', fontSize: 30, padding: 5}} />
          </TouchableOpacity>
          <Text style={{fontSize: 20, flex: 1, marginLeft: 5, color:'black'}}>
           Thông báo
          </Text>
            </View>
            <View style={{ height:1, backgroundColor:'#999999'}}/>
            <ScrollView>
            {(noread.length != 0)?
            <> 
            <Text style={styles.headertext}>{language === 'vn' ? 'Thông báo mới: ' : 'New Notifications'}</Text>
            <FlatList
              data={noread}
              renderItem={({item, index}) => (
            <NotificationForm
                item={item}
                action={()=>{Action(item)}}
                Remove={()=>{ const filteredData = noread.filter(i => i.Messid !== item.Messid);
                  setnoread(filteredData);
                  firestore()
                  .collection('Notification')
                  .doc(item.Messid)
                  .delete()        
                }}/>
            )} />

            </> : null}
            {(read.length != 0)?
            <> 
            <Text style={styles.headertext}>{language === 'vn' ? 'Thông báo đã đọc: ' : 'Read Notifications'}</Text>
            <FlatList
              data={read}
              renderItem={({item, index}) => (
            <NotificationForm
                item={item} 
                action={()=>{Action(item)}}
                Remove={()=>{ const filteredData = read.filter(i => i.Messid !== item.Messid);
                  setread(filteredData);
                  firestore()
                  .collection('Notification')
                  .doc(item.Messid)
                  .delete()        
                }} />
            )}/>
            </> : null}
            
            </ScrollView>
            <View style={{backgroundColor:'#FFCC00', height:1, marginTop:10}}/>
           


        </View>
    )
}
export default NotificationScreen
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection:'column',
      backgroundColor:'#fff'
    },
    headertext:{
      fontSize:16, 
      marginLeft:5, 
      marginBottom:10, 
      marginTop:10,
      color:'black',
      fontWeight:'600'
    }
})