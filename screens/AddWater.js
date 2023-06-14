import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, TextInput, Image,TouchableOpacity} from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";

const AddWater = (props) => {
    const navigation = useNavigation();
    const{user} = useContext(AuthContext);
    const[water, setWater] = useState();
    const language = useContext(LanguageContext);
    const saveWater = async() => {
        if (water==""){
            //just space
        }
        else{
            await firestore().collection('water').add({
                userId: user.uid,
                time: props.date,
                amount: water,
                isDeleted: false
            })
            setWater('');
            if(props.isNavigation){
                navigation.goBack();
            }
        }
    }
    return (
        <View style={styles.container}>
                <Image style={styles.img} source={require( '../assets/water_.png')}/>
                <View style={{flexDirection: 'row', marginStart: 46}}>
                <TextInput style = {styles.textInput} value={water} onChangeText={water=> setWater(water)}/>
                <Text style={styles.text}>ml</Text>
                </View>
            <TouchableOpacity style={styles.button}
            onPress={saveWater}>
                <Text style={styles.text}> {language === 'vn' ? 'Thêm' : 'Add'}</Text>
            </TouchableOpacity>
        </View>
    )
}
export default AddWater;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: "40%",
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