import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import React, {useState} from "react";
import StapleFoodScreen from "./StapleFoodScreen";
import CustomRecipeScreen from "./CustomRecipeScreen";
import CustomFoodScreen from "./CustomFoodScreen";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome5';

const AddFoodScreen = ({route, navigation}) => {
  const [page, setPage] = useState(0);
  const date = route.params?.date || moment(new Date()).format('DD/MM/YYYY');
  const isNavigation = (route.params)? true:false;
  const mealType = route.params?.mealType;
  const back = () => {
    navigation.goBack();
  }
    return(
        <View style={styles.container}>
          <TouchableOpacity style={{marginLeft: 15, marginTop: 5}} onPress={back}>
        <Icon name={'arrow-left'} size={25} />
      </TouchableOpacity>
          <View style={styles.topTab}>
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 0)? '#2AE371' : null,
              borderBottomWidth: (page == 0)? 2:0}
            ]}
            onPress={()=> setPage(0)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 0)? 'bold': 'normal'}
                ]}> Staple </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 1)? '#2AE371' : null,
              borderBottomWidth: (page == 1)? 2:0}
            ]}
            onPress={()=>setPage(1)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 1)? 'bold': 'normal'}
                ]}>Custom Food</Text>
            </TouchableOpacity>
            </View>
            {(() => {
        switch (page) {
          case 0:
            return <StapleFoodScreen date={date} isNavigation={isNavigation} mealType={mealType}/>;
          case 1:
            return <CustomFoodScreen date={date} isNavigation={isNavigation} mealType={mealType}/>;
          default:
            return null;
        }
      })()}
            
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 0.83,
  },
  topTab: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginVertical: 5
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
export default AddFoodScreen;