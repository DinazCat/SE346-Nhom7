import React from "react";
import {View, Text, StyleSheet, TextInput, Image,
   TouchableOpacity} from "react-native";

const AddWater = ({navigation}) => {
    return (
        <View style = {{flex:1}}>
            <View style = {styles.container1}>
                <Image style={styles.img} source={require( '../assets/water_.png')}/>
            </View>
            <View style={styles.container}>
                <Text style= {styles.text}>
                    Add Water - ml
                </Text>
                <TextInput style = {styles.textInput}/>
                
            </View>
            <TouchableOpacity style = {styles.button}>
                <Text style={{flexDirection: 'row', padding: 15, alignItems: 'center', textAlign: 'center', fontSize: 22}}>
                    Add
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