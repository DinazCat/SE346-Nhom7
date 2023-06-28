import React, {useState} from "react";
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Alert} from "react-native";

const GetAgeHeightWeightScreen = ({navigation}) => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const Navigate = () => {
    if (age == '' || weight == '' || height == ''){
      Alert.alert(
        'Input cannot be blank'
      );
    }
    else{
      navigation.navigate('GetSexScreen', {age: age, height: height, weight: weight});
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/fox1.png')} style={styles.img} />
      <View style={styles.cont3}>
        <Text style={styles.title}>Enter Your Age</Text>
        <TextInput style={styles.textinput} keyboardType='number-pad'
                onChangeText={age => {if(parseInt(age)>0||age=='') setAge(age.replace(/[^0-9]/g, ''))}} value={age}/>
        
        <Text style={styles.title}>Enter Your Weight</Text>
        <TextInput style={styles.textinput} keyboardType='number-pad' 
        onChangeText={weight => {if(parseInt(weight)>0||weight=='') setWeight(weight.replace(/[^0-9]/g, ''))}} value={weight}/>

        <Text style={styles.title}>Enter Your Height</Text>
        <TextInput keyboardType = 'number-pad' 
        onChangeText={height => {if(parseInt(height)>0||height=='') setHeight(height.replace(/[^0-9]/g, ''))}} value={height}
        style={styles.textinput} />

        <View style={styles.cont1}>
          <TouchableOpacity style={styles.btn} onPress={Navigate}>
            <Text style={styles.btnText}> Next </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GetAgeHeightWeightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF9AD",
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20,
  },
  textinput: {
    fontSize: 17,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F5E17C",
    borderRadius: 15,
  },
  btn: {
    backgroundColor: "#ECD352",
    paddingHorizontal: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 30,
  },
  btnText: {
    fontSize: 18,
    color: "#FFF",
  },
  cont1: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    marginTop: 30,

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
    borderTopRightRadius: 30
  },
});
