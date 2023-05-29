import React from "react";
import {View, Text, StyleSheet} from "react-native";
import StatisticsStack from "../navigation/StatisticsStack";
import TabContainer from "../components/TabContainer";

const StatisticsScreen = () => {
  return (
    <TabContainer>
      <StatisticsStack/>
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

export default StatisticsScreen;