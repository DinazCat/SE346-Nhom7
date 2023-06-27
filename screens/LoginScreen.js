
import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Image, Platform, StyleSheet, ScrollView} from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';


const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const {login, googleLogin, fbLogin} = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Image style={styles.logo}
                source={require('../assets/iconFox1.jpg')}
            />
            <FormInput
                lbValue={email}
                onChangeText={(userEmail) => setEmail(userEmail)}
                placeholderText="Email"
                iconType="user"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <FormInput
                lbValue={password}
                onChangeText={(userPassword) => setPassword(userPassword)}
                placeholderText="Password"
                iconType="lock"
                secureTextEntry={true}
            />
            <FormButton
                title="Sign in"                
                onPress={() => login(email, password)}
            />

            <TouchableOpacity style={styles.textButton} 
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity>

            {Platform.OS === 'android' ? (
                <View>
                <SocialButton
                    buttonTitle="Sign in with Facebook"
                    btnType="facebook"
                    color="#4867aa"
                    backgroundColor="#e6eaf4"
                    onPress={() => fbLogin()}
                />

                <SocialButton
                    buttonTitle="Sign in with Google"
                    btnType="google"
                    color="#de4d41"
                    backgroundColor="#f5e7ea"
                    onPress={() => googleLogin()}
                />
                </View>
            ) : null}

            <TouchableOpacity
                style={styles.textButton}
                onPress={() => navigation.navigate('signupScreen')}>
                <Text style={styles.navButtonText}>
                Don't have an acount? Create here
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingTop: 20,
      backgroundColor:'#faf9ad'
    },
    logo: {
      height: 300,
      width: 250,
      resizeMode: 'cover',
    },
    text: {
        fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 32,
        marginVertical: 10,
        color: '#000000',
      },
    textButton: {
        marginTop: 35,
        marginBottom: 20
    },
    forgotButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
        fontFamily: 'Lato-Regular',
      },
    navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#009900',
        fontFamily: 'Lato-Regular',
      },
})