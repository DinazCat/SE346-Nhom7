import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from "react-native";
import React, {useState, useContext, useEffect} from "react";
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import moment from "moment";
//để isAdd trong redux = false khi nhấn vào staple

const TakeNoteScreen = ({route, navigation}) => {
    const {user} = useContext(AuthContext);
    const date = (route.params?.time == 'Today')? moment(new Date()).format('DD/MM/YYYY'): route.params?.time;
    const [id, setID] = useState('');
    const [note, setNote] = useState('');
    useEffect(() => {
       getNote();
       }, []);
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
        <View>
           {(id == '')? <TouchableOpacity onPress={addNote}>
                <Text>Save</Text>
            </TouchableOpacity>:  <TouchableOpacity onPress={updateNote}>
                <Text>Save</Text>
            </TouchableOpacity>}
            <Text>Note</Text>
            <TextInput  multiline={true} value={note} onChangeText={note => setNote(note)}></TextInput>
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
  });
export default TakeNoteScreen;