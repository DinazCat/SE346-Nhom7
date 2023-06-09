import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import React, {useState, useContext} from "react";
import StatisticsWeightScreen from "./StatisticsWeightScreen";
import StatisticsHeightScreen from "./StatisticsHeightScreen";
import StatisticsCalories from "./StatisticsCalories";
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
const StatisticsScreen = ({route}) => {
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const[page, setPage] = useState(1);
    return(
        <View style={[styles.container, {backgroundColor: theme === 'light'? '#FFFFFF' : '#747474'}]}>
          <Text style={[styles.header,{color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{language === 'vn' ? 'Biểu đồ' : 'Chart'}</Text>
          <View style={styles.topTab}>
          <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 1)? '#2AE371' : null,
              borderBottomWidth: (page == 1)? 3:0}
            ]}
            onPress={()=>setPage(1)}>
              <Text style={[styles.textBtn,
                {fontWeight: (page == 1)? 'bold': 'normal', color: theme === 'light'? '#000000' : '#FFFFFF'}
                ]}>{language === 'vn' ? 'Cân nặng' : 'Weight'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.btn,
              {borderBottomColor: (page == 0)? '#2AE371' : null,
              borderBottomWidth: (page == 0)? 3:0}
            ]}
            onPress={()=>setPage(0)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 0)? 'bold': 'normal', color: theme === 'light'? '#000000' : '#FFFFFF'}
                ]}>{language === 'vn' ? 'Chiều cao' : 'Height'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 2)? '#2AE371' : null,
              borderBottomWidth: (page == 2)? 3:0}
            ]} 
            onPress={()=>setPage(2)}>
              <Text style={[styles.textBtn,
              
                {fontWeight: (page == 2)? 'bold': 'normal', color: theme === 'light'? '#000000' : '#FFFFFF'}
                ]}>{language === 'vn' ? 'Calories tiêu thụ' : 'Calories burned'}</Text>
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
      justifyContent: 'center',
      borderTopColor: '#DDD',
      borderTopWidth: 1,
      paddingTop: 15
    },
    header: {
      fontSize: 40,
      color: '#000',
      alignSelf: 'center',
      marginBottom: 5
    },
    textBtn:{
      color: '#000',
      fontSize: 16,
      marginBottom: 10
    },
    btn: {
      marginHorizontal: 15,
    },
    
  });
export default StatisticsScreen;