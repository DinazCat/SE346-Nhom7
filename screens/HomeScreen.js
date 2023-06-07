import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from "react-native";
import ProgressCircle from 'react-native-progress-circle'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LanguageContext from "../context/LanguageContext";

const HomeScreen = () => {
  const [baseGoal, setBaseGoal] = useState(0);
  const [exercise, setExercise] = useState(0);
  const [water, setWater] = useState(0);
  const [breakfast, setBreakfast] = useState(0);
  const [lunch, setLunch] = useState(0);
  const [dinner, setDinner] = useState(0);
  const [snacks, setSnacks] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isOver, setIsOver] = useState('Remaining');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [time, setTime] = useState('Today');
  const language = useContext(LanguageContext);


  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
     setShow(false);
     setDate(currentDate);
     let tempDate = new Date(currentDate);
     let newDate = new Date();
     if (newDate.getDate() == tempDate.getDate() && newDate.getMonth() == tempDate.getMonth() && tempDate.getFullYear() == newDate.getFullYear())
     setTime('Today');
    else setTime(moment(new Date(currentDate)).format('DD/MM/YYYY'));
 }
 
  return (
    <ScrollView>
        <View style={styles.container}>
        {show && (
        <DateTimePicker
          value={date}
          mode={'date'}
          display='default'
          onChange={onChange}
        />
      )}
          <TouchableOpacity onPress={()=>setShow(true)}>
          <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
            <Image
                source={require("../assets/calendar.png")}
                resizeMode="contain"
                style={styles.tabIcon}
            />
            <Text style={[styles.text, {fontWeight: "bold", margin: 5}]}>{time}</Text>
          </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.container, { alignItems: "center", justifyContent: "center"}]}>
            <Text style={[styles.text, {color: '#444444'}]}>
              {language === 'vn' ? 'Còn lại = Mục tiêu - Thức ăn + Thể dục' : 'Remaining = Goal - Food + Exercire'}
            </Text>
            <View style={{flexDirection: 'row', alignItems: "center"}}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} >
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}> 
                    {language === 'vn' ? 'Thể dục' : 'Excercise'}
                    </Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}> {exercise} </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}> 
                    {language === 'vn' ? 'Nước' : 'Water'}
                    </Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}> {water} </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}}>
                  <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}> 
                  {language === 'vn' ? 'Ghi chú' : 'Note'}
                  </Text>
                  <Image
                    source={require("../assets/paperclip.png")}
                    resizeMode="contain"
                    style={styles.tabIcon}
                  />
                  </TouchableOpacity>
                </View>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <Text style={[styles.text, {color: '#FFFFFF'}]}> 
                  {language === 'vn' ? 'Mục tiêu cơ bản' : 'Base Goal'}
                  </Text>
                  <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold", marginBottom: 10}]}> {baseGoal} </Text>
                  <ProgressCircle
                    percent={30}
                    radius={70}
                    borderWidth={8}
                    color="#84D07D" //phần trăm chiếm
                    shadowColor="#FFFFFF" //phần trăm không chiếm
                    bgColor="#CFCFCF" //ở trong vòng tròn
                  >
                 <Text style={{ fontSize: 16,  color: '#FFFFFF', fontWeight: 'bold'}}>{remaining}</Text>
                 <Text style={{ fontSize: 16, color: '#FFFFFF'}}>{isOver}</Text>
                 </ProgressCircle>
  
                  <TouchableOpacity style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}> 
                  <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold", margin: 5}]}> 
                  {language === 'vn' ? 'Xem tất cả' : 'View All'}
                  </Text>
                   </TouchableOpacity>
                  
                </View>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}> 
                    {language === 'vn' ? 'Bữa sáng' : 'Breakfast'}
                    </Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}> {breakfast} </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>
                    {language === 'vn' ? 'Bữa trưa' : 'Lunch'}
                    </Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}> {lunch} </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>
                    {language === 'vn' ? 'Bữa tối' : 'Dinner'}
                    </Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}> {dinner} </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}}>
                    <Text style={[styles.text, {color: '#FFFFFF', marginTop: 5}]}>
                    {language === 'vn' ? 'Ăn vặt' : 'Snacks'}
                    </Text>
                    <Text style={[styles.text, {color: '#FFFFFF', fontWeight: "bold"}]}> {snacks} </Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
          <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: "center"}}>
            <Image
                source={require("../assets/microscope.png")}
                resizeMode="contain"
                style={[styles.tabIcon, {marginLeft: 20, marginRight: 5}]}
            />
            <Text style={[styles.text, {fontWeight: "bold", color: '#FFFFFF', margin: 5}]}>
            {language === 'vn' ? 'Phân tích của tôi: ' : 'My analysis: '}
            </Text>
            <Text style={[styles.text, {color: '#FFFFFF'}]}>
            {language === 'vn' ? 'Thiếu hụt' : 'Decifit'}
            </Text>
          </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1, 
    borderColor: "#CFCFCF", 
    borderRadius: 5, 
    backgroundColor: "#CFCFCF", 
    margin: 5,
  },
  text: {
    fontSize: 18,
    color: '#84D07D',
  },

  tabIcon: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
