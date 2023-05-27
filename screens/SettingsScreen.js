import React, {useContext} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { AuthContext } from '../navigation/AuthProvider'
import TabContainer from "../components/TabContainer"
import Ionicons from 'react-native-vector-icons/Ionicons';
const SettingsScreen = () => {
  const {logout} = useContext(AuthContext);
  return (
    <TabContainer>
      <View style={styles.container}>
      <TouchableOpacity style={styles.btnContainer} onPress={() => logout()}>
        <Ionicons name='log-out-outline' size={27} color='#222'/>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
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
    borderColor: '#222',
    borderBottomWidth: 1.5,
    paddingVertical: 8,  
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  btnText: {
    fontSize:18,
    marginLeft: 10,
    fontWeight: '500',
    color: '#222'
  },
});

export default SettingsScreen;
