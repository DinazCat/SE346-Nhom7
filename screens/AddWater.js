import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, TextInput, Image,TouchableOpacity} from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import { useSelector } from "react-redux";

const AddWater = (props) => {
    const navigation = useNavigation();
    const{user} = useContext(AuthContext);
    const[water, setWater] = useState('');
    const language = useContext(LanguageContext);
    const time = useSelector((state)=>state.CaloriesDiary.time);
    const theme = useContext(ThemeContext)
    const saveWater = async() => {
        if (water==""){
            //just space
        }
        else{
            if(props.isNavigation){
                navigation.goBack();
            }
            else{
                navigation.navigate('Home', { screen: 'DetailWaterScreen', params: {time: time}})
            }
            await firestore().collection('water').add({
                userId: user.uid,
                time: props.date,
                amount: water,
                isChecked: false
            })
            
        }
    }
    return (
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
                <Text style={[styles.text, {color: "#fff"}]}> {language === 'vn' ? 'Thêm' : 'Add'}</Text>
            </TouchableOpacity>
        </View>
    )
}
export default AddWater;

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