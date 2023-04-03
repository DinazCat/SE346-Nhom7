import React from 'react'; 
import {Text, TouchableOpacity, StyleSheet, View, StatusBar} from 'react-native'; 

const FormButton = ({title, ...rest}) => { 
    return ( 
        <TouchableOpacity style = {styles.buttonContainer}{...rest}>
            <Text style = {styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}
export default FormButton; 
const styles = StyleSheet.create({ 
    buttonContainer : { 
        marginTop: 10, 
        width: '100%',
        padding: 10,
        backgroundColor: '#66cc00',
        alignItems : 'center', 
        justifyContent : 'center',
        borderRadius: 5
    },
    buttonText:{
        fontSize:18,
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular',
        color: '#000'
    }
});