import React from "react";
import {View, Text, StyleSheet, ScrollView, Image} from "react-native";

import TabContainer from "../components/TabContainer";

const HomeScreen = () => {
  return (
    <ScrollView>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
            <Image
                source={require("../assets/calendar.png")}
                resizeMode="contain"
                style={styles.tabIcon}
            />
            <Text style={[styles.text, {fontWeight: "bold"}]}>Today</Text>
          </View>
        </View>
        <View style={[styles.container, { alignItems: "center", justifyContent: "center"}]}>
            <Text style={[styles.text, {color: '#444444'}]}>Remaining = Goal - Food + Exercire</Text>
          </View>
          <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: "center"}}>
            <Image
                source={require("../assets/microscope.png")}
                resizeMode="contain"
                style={[styles.tabIcon, {marginLeft: 20, marginRight: 5}]}
            />
            <Text style={[styles.text, {fontWeight: "bold", color: '#FFFFFF'}]}>My analysis: </Text>
            <Text style={[styles.text, {color: '#FFFFFF'}]}>Decifit</Text>
          </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1, 
    borderColor: "#CFCFCF", 
    borderRadius: 5, 
    backgroundColor: "#CFCFCF", 
    margin: 5,
  },
  text: {
    fontSize: 18,
    margin: 5,
    color: '#84D07D',
  },

  tabIcon: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
