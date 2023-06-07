import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import React, {useContext} from 'react';
import { LineChart } from 'react-native-chart-kit';
import LanguageContext from "../context/LanguageContext";

export default LineChartWeightScreen = ({navigation}) => {
    const listDays = ['14/6','9/7','11/7','14/7','19/7','11/8','13/8','9/9','11/9']
    const listWeights = [60,61,62,64,65,61,59,56,55]
    const language = useContext(LanguageContext);

    return (
        <View style = {{flex: 1}}>
        <Text style={styles.text}>{language === 'vn' ? 'Theo dõi cân nặng' : 'Weight Tracker'}</Text>
        <TouchableOpacity style= {styles.button}
        onPress={() => navigation.navigate('AddWeight')} > 
          <Text>
          {language === 'vn' ? 'Thêm cân nặng' : 'Add Weight'}
          </Text>
        </TouchableOpacity>
        <LineChart 
          data={{
            labels: listDays,
            datasets: [
              {
                data: listWeights
              }
            ]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisSuffix=" kg"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#f2d805",
            backgroundGradientFrom: "#ffd725",
            backgroundGradientTo: "#ffc126",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    )
        }

const styles = StyleSheet.create({
  container: {

  },
  text: {
    flex: 0.1,
    textAlign: 'center',
    fontSize: 18, 
    color: '#000',
    fontStyle: 'italic | bold',
  },
  button: {
    flex: 0.1,
    borderRadius: 20,
    alignItems: 'center',
    width: '40%',
    backgroundColor: '#e3c443',
    marginLeft: 100,
    justifyContent: 'center'
  },
  lineChart: {
    flex: 0.8,
  } 

});