import { StyleSheet, Text, View, Image, TouchableOpacity, Modal,alert,TextInput } from 'react-native'
import React, { useEffect, useRef, useState, useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ThemeContext from '../context/ThemeContext';
const NotificationForm = ({item,action,Remove}) =>
{
    const theme = useContext(ThemeContext);
    // const Delete = ()=>{
    //     console.log('aaaa')
    // firestore()
    // .collection('Notification')
    // .doc(item.Messid)
    // .delete()
    // .then(()=>{console.log(item.Messid),Remove})
    // .catch(e=>console.log("error when delete: "+e))
    // }
    // useEffect(()=>{
    //     console.log(item)
    //   },[])
      
    return(
        <TouchableOpacity style={[styles.container, {backgroundColor: theme === 'light'? '#fff' : '#4E4E4E'}]} onPress={action}>
              <Image style={styles.UserImage} source={{uri: item.GImg}}/>
              <View style={{flexDirection:'column', width:300}}>
                <Text multiline={true} style={[styles.TextStyle, {color: theme === 'light'? '#000' : '#fff'}]}>{item.Mess}</Text>
                <Text style={[styles.TextStyle, {color: theme === 'light'? '#000' : '#fff'}]}>{item.Time}</Text>
              </View>
            <TouchableOpacity style={styles.DeleteButton} onPress={Remove}>
                <Icon name={'times-circle'}  />
            </TouchableOpacity>

        </TouchableOpacity>
    )
}
export default NotificationForm
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height:80,
        width:390,
        // borderColor:'black',
        // borderWidth:1,
        backgroundColor:'#F5F5F5',
        alignSelf:'center',
    },
    UserImage:{
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight:10,
        marginTop:2,
    },
    TextStyle:{
        color:'black',
    },
    DeleteButton:{
        color: 'black', 
        fontSize: 30, 
        padding: 10,
      },
})