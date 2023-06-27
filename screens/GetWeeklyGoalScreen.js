import React, {useEffect, useState} from "react";
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity } from "react-native";

const GetWeeklyGoalScreen = ({navigation, route}) => {

  const [goal, setGoal] = useState('');

  useEffect(() => {
    if (route.params?.goal == 'Gain weight') {
      setGoal('Gain');
    }
    else{
      setGoal('Lose');
    }
  }, [route.params?.goal]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/fox4.png')} style={styles.img} />
      <View style={styles.cont3}>
      <Text style={[styles.title, {marginTop: 20}]}>What is your weekly goal?</Text>
      <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('GetActivityLevelScreen', {weeklyGoal: '0.25', sex: route.params.sex, age: route.params.age, height: route.params.height, weight: route.params.weight, goal: route.params.goal})}>
            <Text style={styles.btnText}> {goal} 0,25 KG PER WEEK </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('GetActivityLevelScreen', {weeklyGoal: '0.5', sex: route.params.sex, age: route.params.age, height: route.params.height, weight: route.params.weight, goal: route.params.goal})}>
            <Text style={styles.btnText}> {goal} 0,5 KG PER WEEK </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('GetActivityLevelScreen', {weeklyGoal: '1', sex: route.params.sex, age: route.params.age, height: route.params.height, weight: route.params.weight, goal: route.params.goal})}>
            <Text style={styles.btnText}> {goal} 1 KG PER WEEK </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
  );
};

export default GetWeeklyGoalScreen;

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