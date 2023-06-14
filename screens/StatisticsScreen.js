import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import React, {useState, useContext} from "react";
import StatisticsWeightScreen from "./StatisticsWeightScreen";
import StatisticsHeightScreen from "./StatisticsHeightScreen";
import StatisticsCalories from "./StatisticsCalories";
import LanguageContext from "../context/LanguageContext";
const StatisticsScreen = ({route}) => {
  const language = useContext(LanguageContext);
  const[page, setPage] = useState(1);
    return(
        <View style={styles.container}>
          <Text style={styles.header}>{language === 'vn' ? 'Biểu đồ' : 'Chart'}</Text>
          <View style={styles.topTab}>
          <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 1)? '#2AE371' : null,
              borderBottomWidth: (page == 1)? 2:0}
            ]}
            onPress={()=>setPage(1)}>
              <Text style={[styles.textBtn,
                {fontWeight: (page == 1)? 'bold': 'normal'}
                ]}>Weight</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.btn,
              {borderBottomColor: (page == 0)? '#2AE371' : null,
              borderBottomWidth: (page == 0)? 2:0}
            ]}
            onPress={()=>setPage(0)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 0)? 'bold': 'normal'}
                ]}>Height</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 2)? '#2AE371' : null,
              borderBottomWidth: (page == 2)? 2:0}
            ]} 
            onPress={()=>setPage(2)}>
              <Text style={[styles.textBtn,
              
                {fontWeight: (page == 2)? 'bold': 'normal'}
                ]}>Calories</Text>
            </TouchableOpacity>
            </View>
            {(() => {
        switch (page) {
          case 0:
            return <StatisticsHeightScreen/>;
          case 1:
            return <StatisticsWeightScreen/>;
          case 2:
            return <StatisticsCalories/>;
          default:
            return null;
        }
      })()}
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    topTab: {
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center'
    },
    header: {
      fontSize: 40,
      color: '#000',
      alignSelf: 'center'
    },
    textBtn:{
      color: '#000',
      fontSize: 16,
      marginBottom: 10
    },
    btn: {
      marginHorizontal: 30,
    },
    
  });
export default StatisticsScreen;