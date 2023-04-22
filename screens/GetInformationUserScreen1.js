import React from "react";
import { StyleSheet, Image, Text, View, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const GetInformationUser1 = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/img1.png')} style={styles.img} />
      <View style={styles.cont3}>
        <Text style={styles.title}>Enter Your Name</Text>
        <TextInput style={styles.textinput}/>
        <Text style={styles.title}>Entet Your Age</Text>
        <TextInput style={styles.textinput}/>

        <View style={styles.cont1}>
          <TouchableOpacity onPress={() => navigation.navigate('GetInformationUserScreen2')}
            style={styles.btn}>
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GetInformationUser1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF9AD",
  },
  title: {
    fontSize: 25,
    marginTop: 30,
    marginLeft: 20,
  },
  textinput: {
    fontSize: 25,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#F5E17C",
    borderRadius: 20,

  },
  subtitle: {
    fontSize: 20,
    color: "#474747",
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    paddingRight: 80,
    lineHeight: 25,
  },
  btn: {
    backgroundColor: "#ECD352",
    paddingHorizontal: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 30,
  },
  btnText: {
    fontSize: 20,
    color: "#FFF",
  },
  cont1: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    marginTop: 40,

  },
  cont2: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  img: {
    height: "40%",
    width: "80%",
  },
  cont3: {
    flex: 1,
    backgroundColor: "#FFF",
    width: "99%",
    borderRadius: 30,
  },
});
