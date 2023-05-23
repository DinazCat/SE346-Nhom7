import React from "react";
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity } from "react-native";


const GetSexScreen = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/img1.png')} style={styles.img} />
      <View style={styles.cont3}>
      <Text style={[styles.title, {marginTop: 20}]}>Please select which sex</Text>
      <Text style={styles.title}>we should use to caculator</Text>
      <Text style={styles.title}>your calorie needs: </Text>
      <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('GetGoalScreen', {sex: 'Male', age: route.params.age, height: route.params.height, weight: route.params.weight})}>
            <Text style={styles.btnText}> MALE </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('GetGoalScreen', {sex: 'Female', age: route.params.age, height: route.params.height, weight: route.params.weight})}>
            <Text style={styles.btnText}> FEMALE </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
  );
};

export default GetSexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF9AD",
  },
  title: {
    fontSize: 18,
  },
  
  btn: {
    flex: 1, 
    backgroundColor: "#ECD352",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 30,
  },
  btnText: {
    fontSize: 18,
    color: "#FFF",
  },
  cont1: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    marginTop: 20,

  },
  img: {
    height: "40%",
    width: "80%",
  },
  cont3: {
    flex: 1,
    backgroundColor: "#FFF",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',

  },
});
