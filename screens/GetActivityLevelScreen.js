import React, {useContext} from "react";
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';

const GetActivityLevelScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const CaloriesNeedToBurn = (activityLevel)=>{
    let bmr = 0;
    if (route.params.sex == 'Male'){
      bmr = 10 * parseInt(route.params.weight) + 6.25 * parseInt(route.params.height) - 5 * parseInt(route.params.age) + 5;
    }
    else {
      bmr = 10 * parseInt(route.params.weight) + 6.25 * parseInt(route.params.height) - 5 * parseInt(route.params.age) - 161;
    }
    switch (activityLevel){
      case "Not very active":
        bmr = (bmr * 1.2).toFixed();
        break;
      case "Lightly active":
        bmr = (bmr * 1.375).toFixed();
        break;
      case "Moderate":
        bmr = (bmr * 1.55).toFixed();
        break;
      case "Active":
        bmr = (bmr * 1.725).toFixed();
        break;
      case "Very active":
        bmr = (bmr * 1.9).toFixed();
        break;
    }
    switch (route.params.weeklyGoal){
      case "0.25":
          if (route.params.goal == "Lose weight"){
            bmr -= 250;
          }
          else {
            bmr += 250;
          }
          break;
      case "0.5":
          if (route.params.goal == "Lose weight"){
            bmr -= 500;
          }
          else {
            bmr += 500;
          }
          break;
      case "1":
          if (route.params.goal == "Lose weight"){
            bmr -= 1000;
          }
          else {
            bmr += 1000;
          }
          break;
  }
    return bmr;
  }

  

  const Navigate = (activityLevel) => {
    
    firestore().collection('bmi').doc(user.uid).update({
      age: route.params.age,
      height: route.params.height,
      weight: route.params.weight,
      sex: route.params.sex,
      goal: route.params.goal,
      weeklyGoal: route.params.weeklyGoal,
      activityLevel: activityLevel,
    });

    const bmr = CaloriesNeedToBurn(activityLevel);

    firestore().collection('bmiDiary').add({
      bmr: bmr,
      userId: user.uid,
      age: route.params.age,
      height: route.params.height,
      weight: route.params.weight,
      sex: route.params.sex,
      goal: route.params.goal,
      weeklyGoal: route.params.weeklyGoal,
      activityLevel: activityLevel,
      time: firestore.Timestamp.fromDate(new Date()),

    });
    navigation.navigate('TabsNavigator');
  }
  
  return (
    <View style={styles.container}>
      <Image source={require('../assets/img1.png')} style={styles.img} />
      <View style={styles.cont3}>
      <Text style={[styles.title, {marginTop: 20}]}>What is your goal?</Text>
      <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>Navigate('Not very active')}>
            <Text style={styles.btnText}> NOT VERY ACTIVE </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>Navigate('Lightly active')}>
            <Text style={styles.btnText}> SLIGHTLY ACTIVE </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>Navigate('Moderate')}>
            <Text style={styles.btnText}> MODERATE </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>Navigate('Active')}>
            <Text style={styles.btnText}> ACTIVE </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={()=>Navigate('Very active')}>
            <Text style={styles.btnText}> VERY ACTIVE </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
  );
};

export default GetActivityLevelScreen;

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