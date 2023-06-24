import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert} from 'react-native';
import React, { useContext, useState, useEffect} from 'react';
import { BarChart,} from 'react-native-chart-kit';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from "../navigation/AuthProvider";
import LanguageContext from '../context/LanguageContext';
import ThemeContext from '../context/ThemeContext';

const StatisticsCalories = () => {
    const {user} = useContext(AuthContext);
  const listDaysOneWeek =  Array(7).fill().map((item, index)=>moment(new Date()).subtract(6 - index, 'd'));
  const listDaysOneMonth =  Array(31).fill().map((item, index)=>moment(new Date()).subtract(30 - index, 'd'));
  const listDaysOneYear =  Array(13).fill().map((item, index)=>moment(new Date()).subtract(12 - index, 'M'));
  const [listCaloriesOneWeek, setListCaloriesOneWeek] = useState([]);
  const [listCaloriesOneMonth, setListCaloriesOneMonth] = useState([]);
  const [listCaloriesOneYear, setListCaloriesOneYear] = useState([]);
  const [selectedValue, setSelectedValue] = useState("1 week");//
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext)
  const getCaloriesOneWeek = async() => {
    try{
      await firestore()
      .collection('foodsDiary')
      .where('userId', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrCalories = [];
        querySnapshot.forEach(doc =>{
          const {calories, time} = doc.data();
          arr.push({calories: calories, time: time})

        })
        for(let i = 0; i <= listDaysOneWeek.length - 1; i++){
          let arrTemp = arr.filter((item)=>item.time === moment(new Date(listDaysOneWeek[i])).format('DD/MM/YYYY'))
          let total = 0;
          for (let i = 0; i < arrTemp.length; i++){
            total += parseInt(arrTemp[i].calories);
          }
          arrCalories.push(total);
        }
        setListCaloriesOneWeek(arrCalories);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getCaloriesOneMonth = async() => {
    try{
      await firestore()
      .collection('foodsDiary')
      .where('userId', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrCalories = [];
        querySnapshot.forEach(doc =>{
            const {calories, time} = doc.data();
            arr.push({calories: calories, time: time})
  
          })
          for(let i = 0; i <= listDaysOneMonth.length - 1; i++){
            let arrTemp = arr.filter((item)=>item.time === moment(new Date(listDaysOneMonth[i])).format('DD/MM/YYYY'))
            let total = 0;
            for (let i = 0; i < arrTemp.length; i++){
              total += parseInt(arrTemp[i].calories);
            }
            arrCalories.push(total);
          }
          setListCaloriesOneMonth(arrCalories);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getCaloriesOneYear = async() => {
    try{
      await firestore()
      .collection('foodsDiary')
      .where('userId', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrCalories = [];
        querySnapshot.forEach(doc =>{
          const {calories, time} = doc.data();
          arr.push({calories: calories, time: time})
          
        })
        for(let i = 0; i <= listDaysOneYear.length - 1; i++){
          
          let arrTemp = arr.filter((item)=>{
            let itemDate = item.time.split('/');
            let today = moment(new Date(listDaysOneYear[i])).format('DD/MM/YYYY').split('/');
            if (itemDate[2] == today[2] && itemDate[1] == today[1]){
              return item;
            }
          })
          let total = 0;
            for (let i = 0; i < arrTemp.length; i++){
              total += parseInt(arrTemp[i].calories);
            }
            arrCalories.push(total);
        }
        setListCaloriesOneYear(arrCalories);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  
  useEffect(()=>{
    getCaloriesOneWeek();
    getCaloriesOneMonth();
    getCaloriesOneYear();
  }, [])
  
  
        if (listCaloriesOneMonth.length == 0 || listCaloriesOneWeek.length == 0 || listCaloriesOneYear.length == 0) {
    return (
      <View style={{marginTop: 130, flex: 1, alignItems: 'center'}}>
        <Text style={[styles.text, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>Loading!</Text>
      </View>
    );
  }
return(
<View style={[styles.container, {backgroundColor: theme === 'light'? '#FFFFFF' : '#1A1A1A'}]}> 
<Picker 
        selectedValue={selectedValue}
        dropdownIconColor = {theme === 'light'? '#000':'#fff'}
        style={{ height: 50, width: 150, alignSelf: 'center', color: theme === 'light'? '#000' : '#fff'}}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label={language === 'vn'? "1 tuần": "1 week"} value="1 week"/>
        <Picker.Item label={language === 'vn'? "1 tháng": "1 month"} value="1 month" />
        <Picker.Item label={language === 'vn'? "1 năm": "1 year"} value="1 year" />
      </Picker> 
      {(() => {
        switch (selectedValue) {
          case "1 week":
            return <BarChart
            data={{
              labels: listDaysOneWeek.map((item, index)=>item.format('DD/MM')),
              datasets: [
                {
                  data: listCaloriesOneWeek
                }
              ]
            }}
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
              backgroundColor: theme === 'light'? '#FFFFFF' : '#1A1A1A',
              backgroundGradientFrom: theme === 'light'? '#FFFFFF' : '#1A1A1A',
              backgroundGradientTo: theme === 'light'? '#FFFFFF' : '#1A1A1A',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(42, 227, 113, ${opacity})`,
                style: {
                borderRadius: 16,
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
            segments={2}
            
          />;
          case "1 month":
            return <BarChart
            data={{
              labels: listDaysOneMonth.map((item, index)=>item.format('DD/MM')),
              datasets: [
                {
                  data: listCaloriesOneMonth
                }
              ]
            }}
            width={Dimensions.get('window').width - 16}
            height={220}
            hidePointsAtIndex={ Array.from({length: 31}, (v, k) => (k%4 !== 0) ? k : null) }
            chartConfig={{
              backgroundColor: theme === 'light'? '#FFFFFF' : '#1A1A1A',
              backgroundGradientFrom: theme === 'light'? '#FFFFFF' : '#1A1A1A',
              backgroundGradientTo: theme === 'light'? '#FFFFFF' : '#1A1A1A',
              decimalPlaces: 2,
              barPercentage: .3,
              color: (opacity = 1) => `rgba(42, 227, 113, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            segments={2}
          />;
          case "1 year":
            return <BarChart
            data={{
              labels: listDaysOneYear.map((item, index)=>item.format('MM/YY')),
              datasets: [
                {
                  data: listCaloriesOneYear
                }
              ]
            }}
            hidePointsAtIndex={ Array.from({length: 13}, (v, k) => (k%2 !== 0) ? k : null) }
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
              barPercentage: .3,
              backgroundColor: theme === 'light'? '#FFFFFF' : '#1A1A1A',
              backgroundGradientFrom: theme === 'light'? '#FFFFFF' : '#1A1A1A',
              backgroundGradientTo: theme === 'light'? '#FFFFFF' : '#1A1A1A',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(42, 227, 113, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
                        
            segments={2}
          />;
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
  text: {
    textAlign: 'center',
    fontSize: 18, 
    color: '#000',
  },
  
});

export default StatisticsCalories;