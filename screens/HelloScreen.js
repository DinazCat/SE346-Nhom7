import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';



const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/img1.png')} style={styles.img} />
      <Text style={styles.title}>Hello My Sweetie!!</Text>
      <Text style={styles.detail}>
        Hello to our application. We hope that we can help 
        you to control your calories.
      </Text> 
      <TouchableOpacity onPress={() => navigation.navigate('GetInformationUserScreen1')}
        style={styles.btn}>
        <Text style={styles.text}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF9AD",
  },
  img: {
    height: "40%",
    width: "100%",
    resizeMode: "contain",
  },
  title: {
    color: "#000000",
    fontSize: 30,
    marginTop: 20,
  },
  detail: {
    color: "#000000",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 30,
    marginTop: 30,
  },
  btn: {
    marginTop: 50,
    backgroundColor: "#ECD352",
    paddingHorizontal: 140,
    paddingVertical: 10,
    borderRadius: 30,
  },
  text: {
    fontSize: 30,
    color: "#FFF",
  },
});
