import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabContainer from "../components/TabContainer";
import SettingStack from "../navigation/SettingStack";

export default SettingScreenRoot = () => {
    return (
      <TabContainer>
        <SettingStack/>
      </TabContainer>
    );
  };
