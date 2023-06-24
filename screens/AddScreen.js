import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import React, {useContext, useState} from "react";
import StapleFoodScreen from "./StapleFoodScreen";
import CustomRecipeScreen from "./CustomRecipeScreen";
import CustomFoodScreen from "./CustomFoodScreen";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import moment from "moment";
import AddWater from "./AddWater";
import AddExerciseScreen from "./AddExerciseScreen";
import Icon from 'react-native-vector-icons/FontAwesome5';
import ThemeContext from "../context/ThemeContext";
import LanguageContext from "../context/LanguageContext";

const AddScreen = ({route}) => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const language = useContext(LanguageContext);
  const [page, setPage] = useState(3);
  const time = useSelector((state)=>state.CaloriesDiary.time);
  const date = route.params?.date || (time=='Today'? moment(new Date()).format('DD/MM/YYYY'): time);
  const isNavigation = (route.params)? true:false;
  const back = () => {
    navigation.goBack();
  }
    return(
      <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
      <View style={{flex: isNavigation? 0.83: 0.81}}>
        {isNavigation?<TouchableOpacity style={{marginLeft: 15, marginVertical: 5}} onPress={back}>
        <Icon name={'arrow-left'} size={25} color={theme==='light'?"#000":"#fff"}/>
      </TouchableOpacity>:null}
        <View style={{paddingTop: 10, backgroundColor: theme === 'light'? '#FFFFFF' : '#747474'}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginHorizontal: 10}}>
        <View style={styles.topTab}>
          <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 3)? '#2AE371' : null,
              borderBottomWidth: (page == 3)? 3:0}
            ]}
            onPress={()=> setPage(3)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 3)? 'bold': 'normal',
                color: theme==='light'?"#000":"#fff"
                }  
                ]}>{language === 'vn'? 'Nước': 'Water'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 0)? '#2AE371' : null,
              borderBottomWidth: (page == 0)? 3:0}
            ]}
            onPress={()=> setPage(0)}>
                <Text style={[styles.textBtn,
                
                {fontWeight: (page == 0)? 'bold': 'normal',
                color: theme==='light'?"#000":"#fff"}
                ]}>{language === 'vn'? 'Món ăn chính': 'Staple'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 2)? '#2AE371' : null,
              borderBottomWidth: (page == 2)? 3:0}
            ]} onPress={()=>setPage(2)}>
                <Text style={[styles.textBtn,
              {fontWeight: (page == 2)? 'bold': 'normal',
              color: theme==='light'?"#000":"#fff"}
              ]}>{language === 'vn'? 'Món ăn tạo': 'Custom food'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 1)? '#2AE371' : null,
              borderBottomWidth: (page == 1)? 3:0}
            ]} 
            onPress={()=>setPage(1)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 1)? 'bold': 'normal',
                color: theme==='light'?"#000":"#fff"}
                ]}>{language === 'vn'? 'Công thức tạo': 'Custom recipe'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 4)? '#2AE371' : null,
              borderBottomWidth: (page == 4)? 3:0}
            ]} 
            onPress={()=> setPage(4)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 4)? 'bold': 'normal',
                color: theme==='light'?"#000":"#fff"}
                ]}>{language === 'vn'? 'Thể dục': 'Exercise'}</Text>
            </TouchableOpacity>
            </View>
         </ScrollView>
         </View>
            {(() => {
        switch (page) {
          case 0:
            return <StapleFoodScreen date={date} isNavigation={isNavigation}/>;
          case 1:
            return <CustomRecipeScreen/>;
          case 2:
            return <CustomFoodScreen date={date} isNavigation={isNavigation}/>;
          case 3:
            return <AddWater date={date} isNavigation={isNavigation}/>;
          case 4:
            return <AddExerciseScreen date={date} isNavigation={isNavigation}/>;
          default:
            return null;
        }
      })()}
            
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 0.8,
  },
  topTab: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 40,
    color: '#000',
    fontFamily: 'WishShore',
    alignSelf: 'center'
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
export default AddScreen;