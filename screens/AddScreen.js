import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, SafeAreaView,
  LayoutAnimation, ScrollView, TouchableOpacity} from "react-native";

const CONTENT = [
  {
      isExpanded: false,
      category_name: 'Breakfast',
      subcategory: [
          {id: 1, name: 'bread', calories: '300 cl'},
          {id: 2,name: 'coffee', calories: '120 cl'},
      ]
  },
  {
      isExpanded: false,
      category_name: 'Lunch',
      subcategory: [
          {id: 3,name: 'Nodles', calories: '500 cl'},
      ]
  },
  {
      isExpanded: false,
      category_name: 'Dinner',
      subcategory: [
          {id: 4,name: 'Salad', calories: '160 cl'},
          {id: 5,name: 'Meat', calories: '200 cl'},
      ]
  },
  {
      isExpanded: false,
      category_name: 'Snack',
      subcategory: [
          {id: 6,name: 'cokkies', calories: '300 cl'},
      ]
  },
  {
      isExpanded: false,
      category_name: 'Exercise',
      subcategory: [
          {id: 7,name: 'jumpping rope', calories: '-300 cl'},
          {id: 8,name: 'running', calories: '-120 cl'},
      ]
  },
  {
      isExpanded: false,
      category_name: 'Water',
      subcategory: [
          {id: 9, name: 'water', calories: '120ml'},
          {id: 10, name: 'water', calories: '700ml'},
      ]
  },
  ];
  const ExpandableComponent = ({item, onClickFunction}) => {
      const [layourHeight, setlayoutHeight] = useState(0);
      useEffect(()=> {
          if (item.isExpanded) {
              setlayoutHeight(null);
          }else {
              setlayoutHeight(0);
          }
      }, [item.isExpanded] )
      return (
          <View>
              <TouchableOpacity style={styles.item}
              onPress={onClickFunction}>
                  <Text style = {styles.itemText}>
                      {item.category_name}
                  </Text>
              </TouchableOpacity>
              <View style={{
                      height: layourHeight,
                      overflow: 'hidden'
                  }}>
                      { item.subcategory.map((item, key) =>
                      <TouchableOpacity
                          key={key}
                          style={styles.content}
                          >
                              <Text style = {styles.text}>
                                  {item.name}
                              </Text>
                              <Text style = {styles.text}>
                                  {item.calories}
                              </Text>
                              <View style = {styles.separator}/>
                      </TouchableOpacity>)}
                  </View>  
          </View>
      )
  }
  
  const AddScreen = ({navigation}) => {
      const [listDataSource, setlistDataSource] = useState(CONTENT);
  
      const updateLayout = (index) => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          const array = [...listDataSource];
          array[index]['isExpanded'] = !array[index]['isExpanded'];
          setlistDataSource(array)
      }
      return(
          <SafeAreaView style= {{flex:1}}>
              <View style ={styles.container} >
                  <View style = {styles.header}>
                          <Text style={styles.title}>
                              Remaining Calories:
                          </Text>
                          <Text style={styles.title2}>
                              1200
                          </Text>
                  </View> 
  
                  <View style = {styles.buttonAdd}>
                      <TouchableOpacity style = {styles.button} 
                      onPress={() => navigation.navigate('AddWater')} >
                          <Text>
                              Add Water
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style = {styles.button} 
                       onPress={() => navigation.navigate('AddFood')}>
                          <Text>
                              Add Food
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style = {styles.button} onPress={()=>navigation.navigate('AddExercise')}>
                          <Text>
                              Add Exercise
                          </Text>
                      </TouchableOpacity>
                  </View>
  
                  <ScrollView style = {styles.scrollView} >
                      {
                          listDataSource.map((item,key) => (
                              <ExpandableComponent 
                              key={item.category_name}
                              item={item}
                              onClickFunction={() => {
                                  updateLayout(key)
                              }}
                              />
                          ))
                      }
                  </ScrollView>         
              </View>
          </SafeAreaView>
      )
  }
  
  export default AddScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    header: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: '#e3c443',
      flex: 0.1,
    },
  
    buttonAdd: {
      flex: 0.25,
      flexDirection: 'column',
      padding: 5,
    },
    button: {
      alignItems: 'center',
      borderWidth: 3,
      borderRadius: 8,
      borderColor: '#efdd94',
      width: '40%',
      padding: 6,
    },
    scrollView: {
      flex: 0.65,
    },
    remaning: {
      flex: 1,
      borderStyle: 8,
      borderWidth: 2,
      borderColor: '#efdd94',
    },
    title: {
      flex: 2,
      color: "#fff",
      fontSize: 24,
      fontWeight: '1500',
    },
    title2: {
      flex: 1,
      color: "#fff",
      fontSize: 24,
    },
    titleText: {
      flew:1,
      fontSize: 14,
    },
    headerButton: {
      textAlign: 'center',
      justifyContent:'center',
      fontSize: 18,
    },
    item: {
      padding: 20,
      backgroundColor: '#e3c443',
    },
    itemText: {
      fontSize: 16,
      backgroundColor: '#e3c443',
      fontWeight: '500',
    },
    content: {
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: '#efdd94',
      flexDirection: 'row',
    },
    text: {
      fortSize: 16,
      padding: 10,
      
    },
    separator: {
      height: 0.5,
      backgroundColor: 'orange',
      width: "100%",
  
    }
  });