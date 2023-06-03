import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, ScrollView, Alert} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {isAdd, Delete} from "../store/CustomFoodSlice";
import firestore from '@react-native-firebase/firestore';
import moment from "moment";
import { AuthContext } from '../navigation/AuthProvider';


const AddCustomFood = () => {
  const {user} = useContext(AuthContext)
  const dispatch = useDispatch();
  const IngredientList= useSelector((state) => state.IngredientList.value);
  const totalCalories = useSelector((state) => state.IngredientList.totalCalories)
  const image = 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg'
  
  const navigation = useNavigation();
  //thông tin textinput của customFood
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState([])
  const [prepTime, setPrepTime] = useState('')
  const [cookingTime, setCookingtime] = useState('')
  const [receipt, setReceipt] = useState('')

  //thêm ảnh 
 
  
  const addIngredient = () => {
    dispatch(isAdd(true));
    navigation.navigate('StapleFood')
  }

  const DeleteIngredient = (index) => {

    Alert.alert('Delete', 'Do you want to remove ingredient?', [
      {
        text: 'Cancel',
        
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {
        dispatch(Delete(index))
      }},
    ]);
  }

  const saveFood = () => {
    if (IngredientList.length == 0){
      
    }
    else{
    navigation.navigate('AddFood')

    firestore().collection('customFoods').add({
      userId: user.uid,
      time: moment(new Date()).format('DD/MM/YYYY'),
      name: name,
      calories: totalCalories,
      image: 'https://cdn.imgbin.com/0/14/19/imgbin-gelatin-dessert-jelly-bean-computer-icons-black-beans-jasuSuvVV7TcZpYr54xPKtngR.jpg',
      prepTime: '',
      cookingTime: '',
      receipt: '',
      ingredients: IngredientList,
    })
  }
}
  // add image
  return (
    <View style={styles.Container}>
     <TouchableOpacity onPress={saveFood}>
      <Text>Save</Text>
     </TouchableOpacity>
       
            <View style={styles.headerContainer}>
            <TextInput style={styles.foodname}>A</TextInput>
            </View>
            
        <View style={[styles.Container,{height:650}]}>
            <ScrollView style={{flexDirection:'column'}}>               
                    <>
                    <View style={styles.foodInfoWrapper}>
                        <View style={styles.foodInfoItem}>
                        <TextInput style={styles.foodInfoTitle}>A</TextInput>
                        <Text style={styles.foodInfoSubTitle}>Prep</Text>
                        </View>
                        <View style={styles.foodInfoItem}>
                        <TextInput style={styles.foodInfoTitle}>A</TextInput>
                        <Text style={styles.foodInfoSubTitle}>Cooking</Text>
                        </View>     
                        <View style={styles.foodInfoItem}>
                        <TextInput style={styles.foodInfoTitle}>A</TextInput>
                        <Text style={styles.foodInfoSubTitle}>Cal/serving</Text>
                        </View>                                                          
                    </View>              
                     
                     <View style={styles.split}/>
                     <View style={{backgroundColor:'#F5F5F5'}}>
                     <Text style={[styles.PostTitle, {color: '#CE3E3E'}]}>Steps</Text>
                     <TextInput style={styles.PostText}>A</TextInput>
                     </View>
                     

                     <View style={styles.split}/>
                     <View style={{backgroundColor:'#F5F5F5'}}>
                     <Text style={[styles.PostTitle, {color: '#5AC30D'}]}>Ingredients</Text>
                     <TouchableOpacity onPress={()=>addIngredient()}>
                      <Text>Add</Text>
                     
                     </TouchableOpacity>
                     <FlatList 
                      data={IngredientList}
                      renderItem={({item, index}) => (
                        <View>
                          <TouchableOpacity onPress={()=> DeleteIngredient(index)}>
                            <Image source={{uri: item.image}} style={styles.tabIcon}/>
                            <Text>{item.name}</Text>
                            <Text>{item.resultCalories}</Text>
                            <Text>{item.amount}</Text>
                            </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      />
                      {(IngredientList.length > 0)?<Text>Total: {totalCalories}</Text>:null}
                     </View>
                </>
                              
            </ScrollView>
        </View>   
        
    </View>
  )
}
export default AddCustomFood;
            

const styles = StyleSheet.create({
    Container:{
        width: '100%',
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: 5,
    },
    foodname:{
        fontSize: 45,
        textAlign: 'center',
        color: '#000',
        fontFamily: 'WishShore',
    },
    headerContainer:{
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    
    PostText:{
        fontSize: 16,
        paddingHorizontal: 15,
        marginBottom: 5,
        color:'black',
    },
   
    PostTitle:{
        fontSize: 18,
        fontFamily: 'Lato-Regular',
        paddingHorizontal: 15,
        marginBottom: 10,
        fontWeight:"900",
        marginTop: 2,
    },
    
    split: {
        height: 1,
        backgroundColor: '#DDD',
        marginVertical: 10,
        marginHorizontal: 5
    },
    foodInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 15,
      },
      foodInfoItem: {
        justifyContent: 'center',
        width: 100,
        borderRadius: 5,
        paddingVertical: 2,
      },
      foodInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: '#E8B51A'
      },
      foodInfoSubTitle: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
      },
     
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
        header: {
          width: '100%',
          height: 40,
          alignItems: 'flex-end',
          justifyContent: 'center',
        },
        
  });