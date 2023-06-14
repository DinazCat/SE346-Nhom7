import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import React, {useState} from "react";
import StapleFoodScreen from "./StapleFoodScreen";
import CustomRecipeScreen from "./CustomRecipeScreen";
import CustomFoodScreen from "./CustomFoodScreen";
import moment from "moment";
import AddWater from "./AddWater";
import AddExerciseScreen from "./AddExerciseScreen";
//để isAdd trong redux = false khi nhấn vào staple

const AddScreen = ({route}) => {
  const [page, setPage] = useState(3);
  const date = route.params?.date || moment(new Date()).format('DD/MM/YYYY');
  const isNavigation = (route.params)? true:false;
    return(
      <View style={styles.container}>
        <View style={{marginTop: 10}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginHorizontal: 10}}>
        <View style={styles.topTab}>
          <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 3)? '#2AE371' : null,
              borderBottomWidth: (page == 3)? 2:0}
            ]}
            onPress={()=> setPage(3)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 3)? 'bold': 'normal'}
                ]}>Water</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 0)? '#2AE371' : null,
              borderBottomWidth: (page == 0)? 2:0}
            ]}
            onPress={()=> setPage(0)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 0)? 'bold': 'normal'}
                ]}>Staple</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 2)? '#2AE371' : null,
              borderBottomWidth: (page == 2)? 2:0}
            ]} onPress={()=>setPage(2)}>
                <Text style={[styles.textBtn,
              
              {fontWeight: (page == 2)? 'bold': 'normal'}
              ]}>Custom Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 1)? '#2AE371' : null,
              borderBottomWidth: (page == 1)? 2:0}
            ]} 
            onPress={()=>setPage(1)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 1)? 'bold': 'normal'}
                ]}>Custom Recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn,
              {borderBottomColor: (page == 4)? '#2AE371' : null,
              borderBottomWidth: (page == 4)? 2:0}
            ]} 
            onPress={()=> setPage(4)}>
                <Text style={[styles.textBtn,
                {fontWeight: (page == 4)? 'bold': 'normal'}
                ]}>Exercise</Text>
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
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 0.73,
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