import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import {windowHeight, windowWidth} from '../utils/Dimentions';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const FormInput = ({lbValue, placeholderText, iconType, ...rest}) => {
  return (
    <View style={styles.inputContainer}>
        <View style={styles.iconStyle}>
            <FontAwesome5 name={iconType} size = {22} color ='#666' solid/>
        </View>
      <TextInput style={styles.input}
        value={lbValue}
        placeholder={placeholderText}
        placeholderTextColor='#666'
        {...rest}
      />
    </View>
  )
}

export default FormInput

const styles = StyleSheet.create({
    inputContainer: {
      marginTop: 5,
      marginBottom: 10,
      width: '100%',
      height: windowHeight / 15,
      borderColor: '#ccc',
      borderRadius: 5,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    iconStyle: {
      padding: 10,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRightColor: '#ccc',
      borderRightWidth: 1,
      width: 50,
    },
    input: {
      padding: 10,
      flex: 1,
      fontSize: 16,
      fontFamily: 'Lato-Regular',
      color: '#333',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputField: {
      padding: 10,
      marginTop: 5,
      marginBottom: 10,
      width: windowWidth / 1.5,
      height: windowHeight / 15,
      fontSize: 16,
      borderRadius: 8,
      borderWidth: 1,
    },
  });