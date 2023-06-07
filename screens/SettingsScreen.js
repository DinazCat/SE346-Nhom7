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


const SettingsScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const language = useContext(LanguageContext);

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
  return (
    <TabContainer>
      <View style={styles.container}>
        <TouchableOpacity style={styles.btnContainer}
          onPress={() => navigation.navigate('editProfileScreen')}>
          <Ionicons name='person-outline' size={27} color='#222'/>
          <Text style={styles.btnText}>{language === 'vn' ? 'Chỉnh sửa hồ sơ' : 'Edit Profile'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnContainer} 
          onPress={(event) => {setPopoverAnchor(event.nativeEvent.target);
                          setPopoverVisible(true);}}>
          <Ionicons name='language-outline' size={27} color='#222'/>
          <Text style={styles.btnText}>{language === 'vn' ? 'Ngôn ngữ' : 'Language'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnContainer} onPress={() => logout()}>
          <Ionicons name='log-out-outline' size={27} color='#222'/>
          <Text style={styles.btnText}>{language === 'vn' ? 'Đăng xuất' : 'Log Out'}</Text>
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
