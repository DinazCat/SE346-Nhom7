import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import FormButton from '../components/FormButton'
import { AuthContext } from '../navigation/AuthProvider'

const ForgotPassword = () => {
    const {forgotPassword} = useContext(AuthContext);
    const [email, setEmail] = useState();
  return (
    <View style={styles.container}>
      <Text style={styles.forgotpassText}>Forgot password</Text>
      <Text>We'll email you to reset your password</Text>
      <View style={styles.inputContainer}>
        <TextInput 
            placeholder='Email address'
            value={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            />
      </View>
      <FormButton title={'Send'}
        onPress={() => forgotPassword(email)}/>
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20,
        paddingTop: 40,
        backgroundColor:'#faf9ad'
    }, 
    forgotpassText:{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    }, 
    inputContainer:{
        marginTop: 15,
        width: '100%',
        borderColor: 'black',
        borderBottomWidth: 1,
        marginBottom: 15,
    },
})