import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import React, {useContext, useState} from "react";
import StapleFoodScreen from "./StapleFoodScreen";
import CustomRecipeScreen from "./CustomRecipeScreen";
import CustomFoodScreen from "./CustomFoodScreen";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome5';
import ThemeContext from "../context/ThemeContext";
import LanguageContext from "../context/LanguageContext";

const AddFoodScreen = ({route, navigation}) => {
  const [page, setPage] = useState(0);
  const date = route.params?.date || moment(new Date()).format('DD/MM/YYYY');
  const nameScreen = route.params?.nameScreen;
  const mealType = route.params?.mealType;
  const theme = useContext(ThemeContext);
  const language = useContext(LanguageContext)
  const back = () => {
    navigation.goBack();
  }
    return(
      <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity style={{marginLeft: 15, marginVertical: 5}} onPress={back}>
        <Icon name={'arrow-left'} size={25} color={theme==='light'?"#000":"#fff"}/>
      </TouchableOpacity>
      
          <View style={[styles.topTab, {backgroundColor: theme === 'light'? '#FFFFFF' : '#747474'}]}>
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
              {borderBottomColor: (page == 1)? '#2AE371' : null,
              borderBottomWidth: (page == 1)? 3:0}
            ]}
            onPress={()=>setPage(1)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 1)? 'bold': 'normal',
                color: theme==='light'?"#000":"#fff"}
                ]}>{language === 'vn'? 'Món ăn tạo': 'Custom food'}</Text>
            </TouchableOpacity>
            </View>
            {(() => {
        switch (page) {
          case 0:
            return <StapleFoodScreen date={date} nameScreen={nameScreen} mealType={mealType}/>;
          case 1:
            return <CustomFoodScreen date={date} nameScreen={nameScreen} mealType={mealType}/>;
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
    flex: 0.82,
  },
  topTab: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: 10
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
    marginHorizontal: 40,
  },
  
  });
export default AddFoodScreen;