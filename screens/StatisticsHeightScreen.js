import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import React, { useContext, useState, useEffect} from 'react';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from "../navigation/AuthProvider";
import { Picker } from '@react-native-picker/picker';
import LanguageContext from '../context/LanguageContext';
import ThemeContext from '../context/ThemeContext';

const StatisticsHeightScreen = () => {
  const {user} = useContext(AuthContext);
  const listDaysOneWeek =  Array(7).fill().map((item, index)=>moment(new Date()).subtract(6 - index, 'd'));
  const listDaysOneMonth =  Array(31).fill().map((item, index)=>moment(new Date()).subtract(30 - index, 'd'));
  const listDaysOneYear =  Array(13).fill().map((item, index)=>moment(new Date()).subtract(12 - index, 'M'));
  const [listHeightsOneWeek, setListHeightsOneWeek] = useState([]);
  const [listHeightsOneMonth, setListHeightsOneMonth] = useState([]);
  const [listHeightsOneYear, setListHeightsOneYear] = useState([]);
  const [selectedValue, setSelectedValue] = useState("1 week");
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const getHeightOneWeek = async() => {
    try{
      await firestore()
      .collection('bmiDiary')
      .where('userId', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrHeight = [];
        querySnapshot.forEach(doc =>{
          const {height, time} = doc.data();
          arr.push({height: height, time: time})
          
        })
        let arrSort = arr.sort((a,b)=>a.time - b.time);
        for(let i = 0; i <= listDaysOneWeek.length - 1; i++){
          
          let arrTemp = arrSort.filter((item)=>new Date(item.time._seconds * 1000) <= new Date(listDaysOneWeek[i]))
          if (arrTemp.length == 0){
            arrHeight.push(arrSort[0].height);
          }
          else{
            arrHeight.push(arrTemp[arrTemp.length - 1].height);
          }
        }
        setListHeightsOneWeek(arrHeight);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getHeightOneMonth = async() => {
    try{
      await firestore()
      .collection('bmiDiary')
      .where('userId', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrHeight = [];
        querySnapshot.forEach(doc =>{
          const {height, time} = doc.data();
          arr.push({height: height, time: time})
          
        })
        let arrSort = arr.sort((a,b)=>a.time - b.time);
        for(let i = 0; i <= listDaysOneMonth.length - 1; i++){
          
          let arrTemp = arrSort.filter((item)=>new Date(item.time._seconds * 1000) <= new Date(listDaysOneMonth[i]))
          if (arrTemp.length == 0){
            arrHeight.push(arrSort[0].height);
          }
          else{
            arrHeight.push(arrTemp[arrTemp.length - 1].height);
          }
        }
        setListHeightsOneMonth(arrHeight);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getHeightOneYear = async() => {
    try{
      await firestore()
      .collection('bmiDiary')
      .where('userId', '==', user.uid)
      .onSnapshot((querySnapshot)=>{
        let arr = [];
        let arrHeight = [];
        querySnapshot.forEach(doc =>{
          const {height, time} = doc.data();
          arr.push({height: height, time: time})
          
        })
        let arrSort = arr.sort((a,b)=>a.time - b.time);
        for(let i = 0; i <= listDaysOneYear.length - 1; i++){
          
          let arrTemp = arrSort.filter((item)=>{
            if (new Date(item.time._seconds * 1000).getFullYear() < new Date(listDaysOneYear[i]).getFullYear() || (new Date(item.time._seconds * 1000).getMonth() <= new Date(listDaysOneYear[i]).getMonth() && new Date(item.time._seconds * 1000).getFullYear() == new Date(listDaysOneYear[i]).getFullYear())){
              return item;
            }
          })
          if (arrTemp.length == 0){
            arrHeight.push(arrSort[0].height);
          }
          else{
            arrHeight.push(arrTemp[arrTemp.length - 1].height);
          }
        }
        setListHeightsOneYear(arrHeight);
      })
     
    } catch(e){
      console.log(e);
    }
  }
  
  useEffect(()=>{
    getHeightOneWeek();
    getHeightOneMonth();
    getHeightOneYear();
  }, [])
  
  
        if (listHeightsOneMonth.length == 0 || listHeightsOneWeek.length == 0 || listHeightsOneYear.length == 0) {
    return (
      <View style={{marginTop: 130, flex: 1, alignItems: 'center'}}>
        <Text style={[styles.text, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{language==='vn'?'Đang tải!':'Loading!'}</Text>
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
            return <LineChart 
            data={{
              labels: listDaysOneWeek.map((item, index)=>item.format('DD/MM')),
              datasets: [
                {
                  data: listHeightsOneWeek
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
            return <LineChart 
            data={{
              labels: listDaysOneMonth.map((item, index)=>item.format('DD/MM')),
              datasets: [
                {
                  data: listHeightsOneMonth
                }
              ]
            }}
            hidePointsAtIndex={ Array.from({length: 31}, (v, k) => (k%4 !== 0) ? k : null) }
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
          case "1 year":
            return <LineChart 
            data={{
              labels: listDaysOneYear.map((item, index)=>item.format('MM/YY')),
              datasets: [
                {
                  data: listHeightsOneYear
                }
              ]
            }}
            hidePointsAtIndex={ Array.from({length: 13}, (v, k) => (k%2 !== 0) ? k : null) }
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

export default StatisticsHeightScreen;