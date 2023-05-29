import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabContainer from "../components/TabContainer";
import AddStack from "../navigation/AddStack";

export default AddScreenHome = () => {
    return (
      <TabContainer>
        <AddStack/>
      </TabContainer>
    );
  };
