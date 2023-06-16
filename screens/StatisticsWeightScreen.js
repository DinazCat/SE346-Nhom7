import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import React, { useContext, useState, useEffect} from 'react';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from "../navigation/AuthProvider";
import { Picker } from '@react-native-picker/picker';
import LanguageContext from '../context/LanguageContext';
import ThemeContext from '../context/ThemeContext';

const StatisticsWeightScreen = () => {
  const {user} = useContext(AuthContext);
  const listDaysOneWeek =  Array(7).fill().map((item, index)=>moment(new Date()).subtract(6 - index, 'd'));
  const listDaysOneMonth =  Array(31).fill().map((item, index)=>moment(new Date()).subtract(30 - index, 'd'));
  const listDaysOneYear =  Array(13).fill().map((item, index)=>moment(new Date()).subtract(12 - index, 'M'));
  const [listWeightsOneWeek, setListWeightsOneWeek] = useState([]);
  const [listWeightsOneMonth, setListWeightsOneMonth] = useState([]);
  const [listWeightsOneYear, setListWeightsOneYear] = useState([]);
  const [selectedValue, setSelectedValue] = useState("1 week");//
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const getWeightOneWeek = async() => {
    try{
      await firestore()
      .collection('bmiDiary')
      .where('id', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrWeight = [];
        querySnapshot.forEach(doc =>{
          const {weight, time} = doc.data();
          arr.push({weight: weight, time: time})
          
        })
        let arrSort = arr.sort((a,b)=>a.time - b.time);
        for(let i = 0; i <= listDaysOneWeek.length - 1; i++){
          
          let arrTemp = arrSort.filter((item)=>new Date(item.time._seconds * 1000) <= new Date(listDaysOneWeek[i]))
          if (arrTemp.length == 0){
            arrWeight.push(arrSort[0].weight);
          }
          else{
            arrWeight.push(arrTemp[arrTemp.length - 1].weight);
          }
        }
        setListWeightsOneWeek(arrWeight);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getWeightOneMonth = async() => {
    try{
      await firestore()
      .collection('bmiDiary')
      .where('id', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrWeight = [];
        querySnapshot.forEach(doc =>{
          const {weight, time} = doc.data();
          arr.push({weight: weight, time: time})
          
        })
        let arrSort = arr.sort((a,b)=>a.time - b.time);
        for(let i = 0; i <= listDaysOneMonth.length - 1; i++){
          
          let arrTemp = arrSort.filter((item)=>new Date(item.time._seconds * 1000) <= new Date(listDaysOneMonth[i]))
          if (arrTemp.length == 0){
            arrWeight.push(arrSort[0].weight);
          }
          else{
            arrWeight.push(arrTemp[arrTemp.length - 1].weight);
          }
        }
        setListWeightsOneMonth(arrWeight);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getWeightOneYear = async() => {
    try{
      await firestore()
      .collection('bmiDiary')
      .where('id', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrWeight = [];
        querySnapshot.forEach(doc =>{
          const {weight, time} = doc.data();
          arr.push({weight: weight, time: time})
          
        })
        let arrSort = arr.sort((a,b)=>a.time - b.time);
        for(let i = 0; i <= listDaysOneYear.length - 1; i++){
          
          let arrTemp = arrSort.filter((item)=>{
            if (new Date(item.time._seconds * 1000).getFullYear() < new Date(listDaysOneYear[i]).getFullYear() || (new Date(item.time._seconds * 1000).getMonth() <= new Date(listDaysOneYear[i]).getMonth() && new Date(item.time._seconds * 1000).getFullYear() == new Date(listDaysOneYear[i]).getFullYear())){
              return item;
            }
          })
          if (arrTemp.length == 0){
            arrWeight.push(arrSort[0].weight);
          }
          else{
            arrWeight.push(arrTemp[arrTemp.length - 1].weight);
          }
        }
        setListWeightsOneYear(arrWeight);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  
  useEffect(()=>{
    getWeightOneWeek();
    getWeightOneMonth();
    getWeightOneYear();
  }, [])
  
  
        if (listWeightsOneMonth.length == 0 || listWeightsOneWeek.length == 0 || listWeightsOneYear.length == 0) {
    return (
      <View style={{marginTop: 130, flex: 1, alignItems: 'center'}}>
        <Text style={[styles.text, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>Loading!</Text>
      </View>
    );
  }
return(
<View style={[styles.container, {backgroundColor: theme === 'light'? '#FFFFFF' : '#9B9B9B'}]}>
<Picker
        selectedValue={selectedValue}
        style={{width: 150, alignSelf: 'center'}}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label={language === 'vn'? "1 tuần": "1 week"} value="1 week"/>
        <Picker.Item label={language === 'vn'? "1 tháng": "1 month"} value="1 month" />
        <Picker.Item label={language === 'vn'? "1 năm": "1 year"} value="1 year" />
      </Picker> 
      {(() => {
        switch (selectedValue) {
          case "1 week":
            return <LineChart 
            data={{
              labels: listDaysOneWeek.map((item, index)=>item.format('DD/MM')),
              datasets: [
                {
                  data: listWeightsOneWeek,
                  strokeWidth: 2,
                }
              ]
            }}
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
              backgroundColor: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              backgroundGradientFrom: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              backgroundGradientTo: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
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
            return <LineChart 
            data={{
              labels: listDaysOneMonth.map((item, index)=>item.format('DD/MM')),

              datasets: [
                {
                  data: listWeightsOneMonth,
                  strokeWidth: 2,
                  
                }
              ]
            }}
            hidePointsAtIndex={ Array.from({length: 31}, (v, k) => (k%4 !== 0) ? k : null) }
            width={Dimensions.get('window').width- 16}
            height={220}
            chartConfig={{
              backgroundColor: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              backgroundGradientFrom: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              backgroundGradientTo: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
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
            return <LineChart 
            data={{
              labels: listDaysOneYear.map((item, index)=>item.format('MM/YY')),
              
              datasets: [
                {
                  data: listWeightsOneYear
                }
              ]
            }}
            
            hidePointsAtIndex={ Array.from({length: 13}, (v, k) => (k%2 !== 0) ? k : null) }
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
              backgroundColor: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              backgroundGradientFrom: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              backgroundGradientTo: theme === 'light'? '#FFFFFF' : '#9B9B9B',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
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

export default StatisticsWeightScreen;