import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import moment from "moment";
import * as Progress from 'react-native-progress';
import { AuthContext } from '../navigation/AuthProvider';
import { useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";
import { useSelector } from "react-redux";

import PopFoodAmount from "./PopFoodAmount";
const stapleFood = [
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Bowl-of-rice_icon.svg/948px-Bowl-of-rice_icon.svg.png', 
    name: 'Rice', 
    calories:'130', unit:'bowl', baseAmount:'1', fat: '0', carbs: '28', protein: '2' 
  },
  {
    image: 'https://img.freepik.com/premium-photo/bitter-gourd-stir-fried-with-eggs_71919-1126.jpg', 
    name: 'Stir-fried gourd with eggs', 
    calories: '109', unit:'plate', baseAmount:'1', fat: '19', carbs: '4', protein: '6'
    },
    {
      image: 'https://www.freepnglogos.com/uploads/blueberries-png/blueberries-png-image-purepng-transparent-png-image-library-27.png', 
      name: 'Blueberries raw', 
      calories: '83', unit:'cup', baseAmount:'1', fat: '0', carbs: '21', protein: '1'
      },
    {
      image: 'https://img.freepik.com/premium-photo/grapefruit-isolated-white-background_256988-1348.jpg?w=2000', 
      name: 'Grapefruit white raw', 
      calories: '78', unit:'fruit', baseAmount:'1', fat: '0', carbs: '20', protein: '2'
      },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/3068/3068002.png', 
    name: 'Seaweed Nori dried', 
    calories: '5', unit:'sheet', baseAmount:'1', fat: '0', carbs: '1', protein: '1'
    },
  {
    image: 'https://target.scene7.com/is/image/Target/GUEST_0194a7b1-abe7-4df9-b655-2d08529e0206?wid=488&hei=488&fmt=pjpeg', 
    name: 'Carbonated ginger ale', 
    calories: '124', unit:'fl oz', baseAmount:'12', fat: '0', carbs: '32', protein: '0'
    },
  {
    image: 'https://assets.mynetdiary.com/SystemPictures/web/14201.webp?1553628', 
    name: 'Coffee black no sugar', 
    calories: '2', unit:'cup', baseAmount:'1', fat: '1', carbs: '0', protein: '0'
    },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/5501/5501076.png', 
    name: 'Almond meal', 
    calories: '40', unit:'tbsp', baseAmount:'1', fat: '4', carbs: '2', protein: '2'
    },
  {
    image: 'https://freepngimg.com/thumb/bread/143858-baguette-bread-italian-free-clipart-hq.png', 
    name: 'Italian bread', 
    calories: '57', unit:'slice', baseAmount:'1', fat: '1', carbs: '10', protein: '2'
    },
  {
    image: 'https://images.vexels.com/media/users/3/203685/isolated/preview/a355804bcf7a8605b23d82f495cd772d-bread-white-bread-icon.png', 
    name: 'White bread', 
    calories: '67', unit:'slice', baseAmount:'1', fat: '1', carbs: '12', protein: '2'
    },
  {
    image: 'https://s3.amazonaws.com/img.mynetdiary.com/SystemPictures/web/9083.jpg?1553628', 
    name: 'currants european black raw', 
    calories: '6', unit:'g', baseAmount:'10', fat: '0', carbs: '2', protein: '0'
    },
  {
    image: 'https://png.pngitem.com/pimgs/s/72-723093_bread-food-bun-kaiser-roll-hard-dough-bread.png', 
    name: 'Rolls dinner', 
    calories: '87', unit:'roll', baseAmount:'1', fat: '2', carbs: '15', protein: '3'
    },
  {
    image: 'https://png.pngtree.com/png-clipart/20221218/original/pngtree-naan-bread-png-image_8772779.png', 
    name: 'Naan bread', 
    calories: '262', unit:'piece', baseAmount:'1', fat: '5', carbs: '45', protein: '9'
    },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', 
    name: 'Hamburger bun', 
    calories: '120', unit:'roll', baseAmount:'1', fat: '2', carbs: '22', protein: '4'
    },
  {
    image: 'https://media.istockphoto.com/id/1251655603/vector/illustration-of-canned-tuna.jpg?s=612x612&w=0&k=20&c=YPEuE1upoqnC5DXXABpZc9ZaPOpgOEJcUuskI4COEsY=', 
    name: 'Tuna light canned in oil', 
    calories: '339', unit:'can', baseAmount:'1', fat: '2', carbs: '0', protein: '32'
    },
  {
    image: 'https://cdn.shopify.com/s/files/1/0598/8329/0804/products/2033143101_1024x1024.jpg?v=1633522497', 
    name: 'Whitefish smoked', 
    calories: '147', unit:'cup', baseAmount:'1', fat: '1', carbs: '0', protein: '32'
    },
    {
      image: 'https://img.freepik.com/free-photo/fresh-squid_1339-6216.jpg?w=2000', 
      name: 'Squid raw', 
      calories: '92', unit:'g', baseAmount:'100', fat: '1', carbs: '3', protein: '16'
      },
      {
        image: 'https://media.istockphoto.com/id/181389075/photo/snails-in-the-bowl-during-preparation.jpg?s=1024x1024&w=is&k=20&c=9OATWq4Bk7e0URcw6aoIiyF9c_4GGPIPihS2PsKQ0WM=', 
        name: 'Snails raw', 
        calories: '90', unit:'g', baseAmount:'100', fat: '1', carbs: '2', protein: '16'
        },
  {
  image: 'https://cdn.media.amplience.net/i/japancentre/recipe-1434-unagi-don-grilled-eel-rice-bowl/Unagi-don-grilled-eel-rice-bowl?$poi$&w=1200&h=630&sm=c&fmt=auto', 
  name: 'Eel cooked dry heat', 
  calories: '118', unit:'g', baseAmount:'50', fat: '7', carbs: '0', protein: '12'
  },
  {
  image: 'https://www.deliaonline.com/sites/default/files/quick_media/fish-smoked-haddock-with-creme-fraiche-chive-and-butter-sauce.jpg', 
  name: 'Haddock smoked', 
  calories: '116', unit:'g', baseAmount:'100', fat: '1', carbs: '0', protein: '25'
  },
  {
    image: 'https://whiteangusranch.com/wp-content/uploads/2019/04/AllBeefHotDogs.jpg', 
    name: 'Hot dog all beef', 
    calories: '167', unit:'serving', baseAmount:'1', fat: '15', carbs: '1', protein: '6'
    },
  {
    image: 'https://www.mashed.com/img/gallery/the-side-effect-that-will-make-you-want-to-eat-more-liver/intro-1611519051.jpg', 
    name: 'Beef liver raw', 
    calories: '135', unit:'g', baseAmount:'100', fat: '4', carbs: '4', protein: '20'
    },
  {
    image: 'https://png.pngtree.com/png-vector/20221123/ourmid/pngtree-lemon-icon-png-image_6477461.png', 
    name: 'Lemon raw', 
    calories: '17', unit:'fruit', baseAmount:'1', fat: '0', carbs: '5', protein: '1'
    },
                                        
]

const StapleFoodScreen = (props) => {

  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [textInput, onChangeTextInput] = useState('');//tìm kiếm
  const nameScreen = props.nameScreen;
  //add ingredient
  const Add = (item) => {
    navigation.push('EditFood', {item:item, isEdit:false, mealType: props.mealType, nameScreen: nameScreen})
  }
  
  return (
    <View>
      <View style={{flexDirection:'row', marginTop: 10, marginHorizontal: 10, alignItems: 'center'}}>
        <Icon name={'search'} size={25} color={theme==='light'?'#000':'#fff'}/>
        <TextInput 
        style={[styles.textInput, {marginStart: 7, fontSize: 17, color: theme==='light'?"#000":"#fff", borderColor: theme==='light'?"#000":"#fff"}]}
        value={textInput}
        onChangeText={onChangeTextInput}
        placeholder={language === 'vn' ? 'Tìm kiếm món ăn' : 'Search food'}
        placeholderTextColor={theme==='light'?'#BABABA':'#A3A3A3'}
        />
        </View>
        
      
          <FlatList style={{marginTop: 10, marginBottom: 5}}
              data={stapleFood.filter(item=>item.name.toLowerCase().includes(textInput.toLowerCase()))
              }
              renderItem={({item}) => (
                <TouchableOpacity  onPress={() => Add(item)}>
                  <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 15, marginVertical: 3, paddingBottom: 5, flex: 1}}>
                      <Image source = {{uri: item.image}} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <Text style={{fontSize: 18, width: 200, marginStart: 3, color: theme==='light'?"#000":"#fff"}}>{item.name}</Text>
                      <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2'}}>{item.calories} cals</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2'}}>{item.baseAmount} {item.unit}</Text>
                      </View>
                  </View>

                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={()=> (
                <View
    style={{
      height: 2,
      backgroundColor: theme==='light'?"#000":"#fff",
      marginHorizontal: 15
    }}
  />
               )}
          />
          
          </View>

)
}
const styles = StyleSheet.create({
    container: {
      borderWidth: 1, 
      borderColor: "#CFCFCF", 
      borderRadius: 5, 
      backgroundColor: "#CFCFCF", 
      margin: 5,
    },
    text: {
      padding: 10,
      fontSize: 18,
      height: 50,
      textAlign: 'center'
  },
  textInfo: {
    fontSize: 18,
},
    header: {
      width: '100%',
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    textInput: {
      borderWidth: 1,
      borderRadius: 10,
      width: "90%",
      height: 50,
  },
  button: {
    marginTop: 15,
    borderRadius: 20,
    width: '40%',
    padding: 5,
    backgroundColor: '#2AE371',
    alignSelf: 'center'
  },
});
export default StapleFoodScreen;