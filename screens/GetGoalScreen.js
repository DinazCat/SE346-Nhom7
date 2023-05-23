import React from "react";
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity } from "react-native";


const GetGoalScreen = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/img1.png')} style={styles.img} />
      <View style={styles.cont3}>
      <Text style={[styles.title, {marginTop: 20}]}>What is your goal?</Text>
      <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('GetWeeklyGoalScreen', {sex: route.params.sex, age: route.params.age, height: route.params.height, weight: route.params.weight, goal: 'Lose weight'})}>
            <Text style={styles.btnText}> LOSE WEIGHT </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('GetActivityLevelScreen', {sex: route.params.sex, age: route.params.age, height: route.params.height, weight: route.params.weight, goal: 'Maintain weight', weeklyGoal: '0'})}>
            <Text style={styles.btnText}> MAINTAIN WEIGHT </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('GetWeeklyGoalScreen', {sex: route.params.sex, age: route.params.age, height: route.params.height, weight: route.params.weight, goal: 'Gain weight'})}>
            <Text style={styles.btnText}> GAIN WEIGHT </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
  );
};

export default GetGoalScreen;

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
