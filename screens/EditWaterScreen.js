import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, TextInput, Image,TouchableOpacity} from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import Icon from 'react-native-vector-icons/FontAwesome5';
const EditWaterScreen = ({route}) => {
    const navigation = useNavigation();
    const{user} = useContext(AuthContext);
    const[water, setWater] = useState(route.params?.item.amount);
    const language = useContext(LanguageContext);
    const theme = useContext(ThemeContext);
    const back = () => {
        navigation.goBack();
      }
    const saveWater = async() => {
        if (water==""){
            //just space
        }
        else{
            navigation.goBack();
            firestore().collection('water').doc(route.params?.item.id).update({
                amount: water
            })
        }
    }
    return (
        <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
  <TouchableOpacity style={{marginLeft: 15, marginVertical: 5}} onPress={back}>
    <Icon name={'arrow-left'} size={25} color={theme==='light'?"#000":"#fff"}/>
  </TouchableOpacity>
  <View style={[styles.container]}>
                <Image style={styles.img} source={require( '../assets/water_.png')}/>
                <View style={{flexDirection: 'row', marginStart: 46}}>
                <TextInput 
                placeholder={language === 'vn' ? 'Nhập lượng nước' : 'Enter amount of water'}
                placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
                style = {[styles.textInput, {color: theme==='light'?"#000":"#fff", borderColor: theme==='light'?"#000":"#fff"}]} value={water} onChangeText={water=> setWater(water)}/>
                <Text style={[styles.text, {color: theme==='light'?"#000":"#fff"}]}>ml</Text>
                </View>
            <TouchableOpacity style={styles.button}
            onPress={saveWater}>
                <Text style={[styles.text, {color: "#fff"}]}> {language === 'vn' ? 'Lưu' : 'Save'}</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}
export default EditWaterScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    img: {
        height: 150,
        width: 120,
        margin: 15
    },
    text: {
        padding: 10,
        fontSize: 18,
        height: 50,
        textAlign: 'center'
    },
    textInput: {
        borderWidth: 3,
        borderRadius: 10,
       
        height: 50,
    },
    button: {
        marginTop: 15,
        borderRadius: 20,
        width: '40%',
        padding: 5,
        backgroundColor: '#2AE371',
    },
});