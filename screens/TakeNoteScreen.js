import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from "react-native";
import React, {useState, useContext, useEffect} from "react";
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import moment from "moment";
import ThemeContext from "../context/ThemeContext";
import LanguageContext from "../context/LanguageContext";

const TakeNoteScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const date = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time;
    const [id, setID] = useState('');
    const [note, setNote] = useState('');
    const theme = useContext(ThemeContext);
    const language = useContext(LanguageContext);
    useEffect(() => {
       getNote();
       }, []);
    const cancel = () => {
      navigation.goBack();
    }
    const getNote = () => {
        try{
            firestore()
            .collection('note')
            .where('userId', '==', user.uid)
            .where('time', '==', date)
            .onSnapshot((querySnapshot)=>{
                let list = [];
                querySnapshot.forEach(doc =>{
                  const {content} = doc.data();
                  list.push({content: content, id: doc.id})
                })
                if (list.length > 0) {
                    setNote(list[0].content);
                    setID(list[0].id)
                }
              })
           
          } catch(e){
            console.log(e);
          }
    }
    const updateNote = async() => {
        try{
            await firestore().collection('note').doc(id).update({
                content: note
            })
            
            console.log('save note succesfully');
            Alert.alert(
              'Save note succesfully!'
            );
            navigation.navigate('HomeScreen')
          } 
          catch (error) {
            console.log('something went wrong!', error);
          }
    }
    const addNote = () => {
        firestore().collection('note').add({
            userId: user.uid,
            time: date,
            content: note
        })
        navigation.navigate('HomeScreen');
    }
 
    return(
      <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 15, backgroundColor: theme === 'light' ?'#2AE371': '#747474'}}>
        <TouchableOpacity onPress={cancel}>
        <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Hủy' : 'Cancel'}</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 23, color: '#fff', fontWeight: 'bold', textAlign: 'center', width: 250}}>{language === 'vn' ? 'Ghi chú' : 'Take note'}</Text>
           {(id == '')? <TouchableOpacity onPress={addNote}>
                <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Lưu' : 'Save'}</Text>
            </TouchableOpacity>:  <TouchableOpacity onPress={updateNote}>
                <Text style={[styles.text, {color: theme === 'light' ?'#fff': '#2AE371'}]}>{language === 'vn' ? 'Lưu' : 'Save'}</Text>
                
            </TouchableOpacity>}
            </View>
         
            <TextInput style={{color: theme === 'light' ?'#000': '#fff', borderColor: theme==='light'?"#000":"#fff", paddingHorizontal: 10}}  
            placeholder={language === 'vn' ? 'Nhập ghi chú' : 'Enter note'} 
            placeholderTextColor={theme==='light'?'#C7C7CD':'#A3A3A3'}
            multiline={true} value={note} onChangeText={note => setNote(note)}></TextInput>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      borderWidth: 1, 
      borderColor: "#CFCFCF", 
      borderRadius: 5, 
      backgroundColor: "#CFCFCF", 
      margin: 5,
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
  });
export default TakeNoteScreen;