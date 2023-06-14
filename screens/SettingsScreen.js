import React, {useContext, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import { AuthContext } from '../navigation/AuthProvider'
import TabContainer from "../components/TabContainer"
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Popover from 'react-native-popover-view';
import LanguageContext from "../context/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from 'react-native-restart';
import ThemeContext from "../context/ThemeContext";
import firestore from '@react-native-firebase/firestore';


const SettingsScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const [isPopoverThemeVisible, setPopoverThemeVisible] = useState(false);
  const [popoverThemeAnchor, setPopoverThemeAnchor] = useState(null);

  const handleLanguageChange = async (newLanguage) => {
    if (language !== newLanguage){
      try {
        await AsyncStorage.setItem('language', newLanguage);
        RNRestart.Restart();
      } catch (error) {
        console.log('Error saving language to AsyncStorage:', error);
      }
    }
    setPopoverVisible(false);
  };
  const handleThemeChange = async (newTheme) => {
    if (theme !== newTheme){
      try {
        await firestore().collection('theme').doc(user.uid).set({
          theme: newTheme
        }).then().catch((e)=>{console.log("error "+ e)});
        RNRestart.Restart();
      }
      catch (error) {
        console.log('Error saving theme', error);
      }
    }
    setPopoverThemeVisible(false);
  };
  return (
    <TabContainer>
      <View style={[styles.container, {backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}]}>
        <TouchableOpacity style={styles.btnContainer}
          onPress={() => navigation.navigate('editProfileScreen')}>
          <Ionicons name='person-outline' size={27} color={theme === 'light'? '#000000' : '#FFFFFF'}/>
          <Text style={[styles.btnText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{language === 'vn' ? 'Chỉnh sửa hồ sơ' : 'Edit Profile'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnContainer} 
          onPress={(event) => {setPopoverAnchor(event.nativeEvent.target);
                          setPopoverVisible(true);}}>
          <Ionicons name='language-outline' size={27} color={theme === 'light'? '#000000' : '#FFFFFF'}/>
          <Text style={[styles.btnText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{language === 'vn' ? 'Ngôn ngữ' : 'Language'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnContainer} 
          onPress={(event) => {setPopoverThemeAnchor(event.nativeEvent.target);
            setPopoverThemeVisible(true);}}>
          <Ionicons name='contrast-outline' size={27} color={theme === 'light'? '#000000' : '#FFFFFF'}/>
          <Text style={[styles.btnText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{language === 'vn' ? 'Sáng tối' : 'Theme'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnContainer} 
          onPress={() => navigation.navigate('settingNoti')}>
          <Ionicons name="notifications-circle-outline" size={27} color={theme === 'light'? '#000000' : '#FFFFFF'}/>
          <Text style={[styles.btnText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{language === 'vn' ? 'Thông báo' : 'Notifications'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnContainer} onPress={() => logout()}>
          <Ionicons name='log-out-outline' size={27} color={theme === 'light'? '#000000' : '#FFFFFF'}/>
          <Text style={[styles.btnText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{language === 'vn' ? 'Đăng xuất' : 'Log Out'}</Text>
        </TouchableOpacity>
        
        <Popover
            isVisible={isPopoverVisible}
            onRequestClose={() => setPopoverVisible(false)}
            fromView={popoverAnchor}>
            <View style={styles.popover}>              
                <TouchableOpacity onPress={() => handleLanguageChange('en')}>
                    <View style={styles.popoverItem}>
                        <Image source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-edge-22-624926.png' }} style={{ width: 33, height: 33 }}/>
                        <Text style={{ fontSize: 20, color: 'black', marginLeft:15 }}>English</Text>
                    </View>
                </TouchableOpacity>           
                <TouchableOpacity onPress={() => handleLanguageChange('vn')}>
                    <View style={styles.popoverItem}>
                        <Icon name="vimeo" size={35} color="black" />
                        <Text style={{ fontSize: 20, color: 'black', marginLeft: 13 }}>Vietnamese</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Popover>

        <Popover
            isVisible={isPopoverThemeVisible}
            onRequestClose={() => setPopoverThemeVisible(false)}
            fromView={popoverThemeAnchor}>
            <View style={styles.popover}>              
                <TouchableOpacity onPress={() => handleThemeChange('light')}>
                    <View style={styles.popoverItem}>
                        <Image source={{ uri: 'https://cdn2.iconfinder.com/data/icons/canoopi-mobile-contact-apps/32/Light_Theme-512.png' }} style={{ width: 35, height: 35 }}/>
                        <Text style={{ fontSize: 20, color: 'black', marginLeft:15 }}>{language === 'vn' ? 'Sáng' : 'Light'}</Text>
                    </View>
                </TouchableOpacity>           
                <TouchableOpacity onPress={() => handleThemeChange('dark')}>
                    <View style={styles.popoverItem}>
                    <Image source={{ uri: 'https://static.thenounproject.com/png/1664849-200.png' }} style={{ width: 35, height: 35 }}/>
                        <Text style={{ fontSize: 20, color: 'black', marginLeft: 13 }}>{language === 'vn' ? 'Tối' : 'Dark'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Popover>
      </View>
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff',
    padding: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 32,
    
  },
  btnContainer: {
    flexDirection: 'row',
    width: '100%',
    borderColor: '#AAA',
    borderBottomWidth: 1.5,
    paddingVertical: 10,  
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  btnText: {
    fontSize:18,
    marginLeft: 10,
    fontWeight: '500',
    color: '#222'
  },
  popover:{
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 16, 
  },
  popoverItem:{
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  }
});

export default SettingsScreen;
