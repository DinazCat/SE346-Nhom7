import React from "react";
import {View, Text, StyleSheet} from "react-native";

import TabContainer from "../components/TabContainer";

const AddScreen = () => {
  return (
    <TabContainer>
      <View style={styles.container}>
        <Text style={styles.text}>Add Screen</Text>
      </View>
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

export default AddScreen;