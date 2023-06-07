import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, TextInput, Image,TouchableOpacity} from "react-native";
import firestore from '@react-native-firebase/firestore';
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';
import LanguageContext from "../context/LanguageContext";

const AddWater = ({navigation}) => {
    const{user} = useContext(AuthContext);
    const[water, setWater] = useState();
    const language = useContext(LanguageContext);

    const saveWater = () => {
        if (water==""){
            //just space
            
        }
        else{
            
        
            firestore().collection('water').add({
                userId: user.uid,
                time: moment(new Date()).format('DD/MM/yyyy'),
                amount: water,
                isDeleted: false
              })
              navigation.navigate('AddScreen')
        }
    }
    return (
        <View style = {{flex:1}}>
            <View style = {styles.container1}>
                <Image style={styles.img} source={require( '../assets/water_.png')}/>
            </View>
            <View style={styles.container}>
                <Text style= {styles.text}>
                {language === 'vn' ? 'Thêm nước - ml' : 'Add water - ml'}
                </Text>
                <TextInput style = {styles.textInput} value={water} onChangeText={water=> setWater(water)}/>
                
            </View>
            <TouchableOpacity style = {styles.button}
            onPress={saveWater}>
                <Text style={{flexDirection: 'row', padding: 15, alignItems: 'center', textAlign: 'center', fontSize: 22}}>
                    {language === 'vn' ? 'Thêm' : 'Add'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
export default AddWater;

const styles = StyleSheet.create({
    container1: {
        flex: 0.3,
    },
    container: {
        flex: 0.1,
        flexDirection: 'row',
    },
    img: {
        height: 150,
        width: 120,
    },
    text: {
        padding: 10,
        fontSize: 18,
        width: "40%",
        height: 50,
    },
    textInput: {
        borderWidth: 3,
        borderRadius: 10,
        width: "40%",
        height: 50,
    },
    button: {
        flex: 0.1,
        borderRadius: 20,
        alignItems: 'center',
        width: '40%',
        backgroundColor: '#e3c443',
        marginLeft: 100,
    },
});