import React from "react";
import {View, Text, StyleSheet} from "react-native";
import HomeStack from "../navigation/HomeStack";

import TabContainer from "../components/TabContainer";

const HomePageScreen = () => {
  return (
      <HomeStack/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 32,
  },
});

export default HomePageScreen;
