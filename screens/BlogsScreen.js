import React from "react";
import {View, Text, StyleSheet} from "react-native";

import TabContainer from "../components/TabContainer";
import AppStack from "../navigation/AppStack";

const HomeScreen = () => {
  return (
    <TabContainer>
      <AppStack/>
    </TabContainer>
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

export default HomeScreen;
