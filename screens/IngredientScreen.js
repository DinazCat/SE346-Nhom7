import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import React, {useState, useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../navigation/AuthProvider';
import { useDispatch } from "react-redux";
import { Add } from "../store/CustomRecipeSlice";
import { useSelector } from "react-redux";
import { Picker } from '@react-native-picker/picker';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from "../context/ThemeContext";

import PopFoodAmount from "./PopFoodAmount";
const stapleFood = [
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Bowl-of-rice_icon.svg/948px-Bowl-of-rice_icon.svg.png', 
    name: 'Rice', 
    calories:'130', unit:'bowl', baseAmount:'1', fat: '3', carbs: '6', protein: '9' 
  },
  {
    image: 'https://img.freepik.com/premium-photo/bitter-gourd-stir-fried-with-eggs_71919-1126.jpg', 
    name: 'Stir-fried gourd with eggs', 
    calories: '109', unit:'plate', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
    {
      image: 'https://www.freepnglogos.com/uploads/blueberries-png/blueberries-png-image-purepng-transparent-png-image-library-27.png', 
      name: 'Blueberries raw', 
      calories: '83', unit:'cup', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
      },
    {
      image: 'https://img.freepik.com/premium-photo/grapefruit-isolated-white-background_256988-1348.jpg?w=2000', 
      name: 'Grapefruit white raw', 
      calories: '78', unit:'fruit', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
      },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/3068/3068002.png', 
    name: 'Seaweed Nori dried', 
    calories: '5', unit:'sheet', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://target.scene7.com/is/image/Target/GUEST_0194a7b1-abe7-4df9-b655-2d08529e0206?wid=488&hei=488&fmt=pjpeg', 
    name: 'Carbonated ginger ale', 
    calories: '124', unit:'fl oz', baseAmount:'12', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://assets.mynetdiary.com/SystemPictures/web/14201.webp?1553628', 
    name: 'Coffee black no sugar', 
    calories: '2', unit:'cup', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/5501/5501076.png', 
    name: 'Almond meal', 
    calories: '40', unit:'tbsp', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://freepngimg.com/thumb/bread/143858-baguette-bread-italian-free-clipart-hq.png', 
    name: 'Italian bread', 
    calories: '57', unit:'slice', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://images.vexels.com/media/users/3/203685/isolated/preview/a355804bcf7a8605b23d82f495cd772d-bread-white-bread-icon.png', 
    name: 'White bread', 
    calories: '67', unit:'slice', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://s3.amazonaws.com/img.mynetdiary.com/SystemPictures/web/9083.jpg?1553628', 
    name: 'currants european black raw', 
    calories: '6', unit:'g', baseAmount:'10', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://png.pngitem.com/pimgs/s/72-723093_bread-food-bun-kaiser-roll-hard-dough-bread.png', 
    name: 'Rolls dinner', 
    calories: '87', unit:'roll', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://png.pngtree.com/png-clipart/20221218/original/pngtree-naan-bread-png-image_8772779.png', 
    name: 'Naan bread', 
    calories: '262', unit:'piece', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', 
    name: 'Hamburger', 
    calories: '151', unit:'roll', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://media.istockphoto.com/id/1251655603/vector/illustration-of-canned-tuna.jpg?s=612x612&w=0&k=20&c=YPEuE1upoqnC5DXXABpZc9ZaPOpgOEJcUuskI4COEsY=', 
    name: 'Tuna light canned in oil', 
    calories: '339', unit:'can', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://cdn.shopify.com/s/files/1/0598/8329/0804/products/2033143101_1024x1024.jpg?v=1633522497', 
    name: 'Whitefish smoked', 
    calories: '147', unit:'cup', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
    {
      image: 'https://img.freepik.com/free-photo/fresh-squid_1339-6216.jpg?w=2000', 
      name: 'Squid raw', 
      calories: '92', unit:'g', baseAmount:'100', fat: '3', carbs: '6', protein: '9'
      },
      {
        image: 'https://media.istockphoto.com/id/181389075/photo/snails-in-the-bowl-during-preparation.jpg?s=1024x1024&w=is&k=20&c=9OATWq4Bk7e0URcw6aoIiyF9c_4GGPIPihS2PsKQ0WM=', 
        name: 'Snails raw', 
        calories: '90', unit:'g', baseAmount:'100', fat: '3', carbs: '6', protein: '9'
        },
  {
  image: 'https://cdn.media.amplience.net/i/japancentre/recipe-1434-unagi-don-grilled-eel-rice-bowl/Unagi-don-grilled-eel-rice-bowl?$poi$&w=1200&h=630&sm=c&fmt=auto', 
  name: 'Eel cooked dry heat', 
  calories: '118', unit:'g', baseAmount:'50', fat: '3', carbs: '6', protein: '9'
  },
  {
  image: 'https://www.deliaonline.com/sites/default/files/quick_media/fish-smoked-haddock-with-creme-fraiche-chive-and-butter-sauce.jpg', 
  name: 'Haddock smoked', 
  calories: '116', unit:'g', baseAmount:'100', fat: '3', carbs: '6', protein: '9'
  },
  {
    image: 'https://whiteangusranch.com/wp-content/uploads/2019/04/AllBeefHotDogs.jpg', 
    name: 'Hot dog all beef', 
    calories: '167', unit:'serving', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://www.mashed.com/img/gallery/the-side-effect-that-will-make-you-want-to-eat-more-liver/intro-1611519051.jpg', 
    name: 'Beef liver raw', 
    calories: '135', unit:'g', baseAmount:'100', fat: '3', carbs: '6', protein: '9'
    },
  {
    image: 'https://png.pngtree.com/png-vector/20221123/ourmid/pngtree-lemon-icon-png-image_6477461.png', 
    name: 'Lemon raw', 
    calories: '17', unit:'fruit', baseAmount:'1', fat: '3', carbs: '6', protein: '9'
    },
]

const IngredientScreen = ({route}) => {
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext)
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  //lưu dữ liệu đồ ăn
  const [unit, setUnit] = useState();
  const [baseAmount, setBaseAmount] = useState('');
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState();
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const dispatch = useDispatch();

  const [textInput, onChangeTextInput] = useState('');//tìm kiếm
  const [textSearch, onChangeTextSearch] = useState('');//nhập gram
  
  //modal
  const [visible, setVisible] = React.useState(false);
  //add ingredient
  const isAddIngredient = () => {
    
      if (textSearch==""){
        //just space
      }
      else{
        
      const resultCalories = (parseInt(textSearch) * parseInt(calories) / parseInt(baseAmount)).toFixed();
      const _fat = (parseInt(textSearch) * parseInt(fat) / parseInt(baseAmount)).toFixed();
      const _carbs = (parseInt(textSearch) * parseInt(carbs) / parseInt(baseAmount)).toFixed();
      const _protein = (parseInt(textSearch) * parseInt(protein) / parseInt(baseAmount)).toFixed();
      dispatch(Add(image, name, calories, unit, baseAmount, resultCalories, textSearch, _carbs, _fat, _protein));
      navigation.goBack();
    } 
    
  }
  
  const back = () => {
    navigation.goBack();
  }
  const ShowAddAmount = (item) => {
    onChangeTextSearch('');
    setCalories(item.calories);
    setBaseAmount(item.baseAmount);
    setUnit(item.unit);
    setImage(item.image);
    setName(item.name);
    setCarbs(item.carbs);
    setProtein(item.protein);
    setFat(item.fat);
    setVisible(true);
  }


  
  return (
    <View style={{backgroundColor: theme==='light'?"#fff":"#000", borderColor: theme==='light'?"#000":"#fff", flex: 1}}>
      <TouchableOpacity style={{marginLeft: 15, marginTop: 5}} onPress={back}>
        <Icon name={'arrow-left'} size={25} color={theme==='light'?'#000':'#fff'}/>
      </TouchableOpacity>
      <View style={{flexDirection:'row', marginTop: 5, marginHorizontal: 15, alignItems: 'center'}}>
        <Icon name={'search'} size={25} color={theme==='light'?'#000':'#fff'}/>
        <TextInput
        value={textInput}
        style={[styles.textInput, {marginStart: 7, fontSize: 17, color: theme==='light'?"#000":"#fff", borderColor: theme==='light'?"#000":"#fff"}]}
        onChangeText={onChangeTextInput}
        placeholder={language === 'vn' ? 'Tìm nguyên liệu' : 'Search ingredient'}
        placeholderTextColor={theme==='light'?'#000':'#fff'}
        />
        </View>
        <PopFoodAmount visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={{uri: 'https://static.vecteezy.com/system/resources/previews/018/887/462/original/signs-close-icon-png.png'}}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center', justifyContent:'center', flexDirection: 'row'}}>
          <Image
            source={{uri:image}}
            style={{height: 120, width: 120, marginVertical: 10}}
          />
        <View style={{marginStart: 15, marginVertical: 5}}>
            <Text style={{fontSize: 15, width: 150}}>{name}</Text>
            <Text style={{fontSize: 15}}>{calories} cals/{(baseAmount!='1')?baseAmount+" ":''}{unit}</Text>
            <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 13, color: '#5ADFC8'}}>Carbs: </Text>
            <Text style={{fontSize: 13}}>{carbs} g</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 13, color: '#CE65E0'}}>{language==='vn'?'Chất đạm: ':'Protein: '}</Text>
              <Text style={{fontSize: 13}}>{protein} g</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 13, color: '#E8B51A'}}>{language==='vn'?'Chất béo: ':'Fat: '}</Text>
              <Text style={{fontSize: 13}}>{fat} g</Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
        <TextInput style={[styles.textInput, {width: 220}]} value={textSearch} onChangeText={textSearch  =>onChangeTextSearch(textSearch)}/>
        <Text style={styles.text}>{unit}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={()=>isAddIngredient()}>
        <Text style={styles.text}>{language === 'vn' ? 'Thêm' : 'Add'}</Text>
        </TouchableOpacity>
      </PopFoodAmount>
        
          <FlatList 
              data={stapleFood.filter(item=>item.name.toLowerCase().includes(textInput.toLowerCase()))
              }
              renderItem={({item}) => (
                <TouchableOpacity  onPress={() => ShowAddAmount(item)}>
                  <View style={{alignItems: 'center', flexDirection: 'row', marginHorizontal: 15, marginVertical: 3, paddingBottom: 5}}>
                      <Image source = {{uri: item.image}} style={{width: 40,
        height: 40,
        resizeMode: 'stretch'}}/>
                      <Text style={{fontSize: 18, width: 200, marginStart: 3, color: theme==='light'?"#000":"#fff"}}>{item.name}</Text>
                      <View style={{marginLeft:'auto'}}>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.calories} cals</Text>
                      <Text style={{marginLeft:'auto', fontSize: 16, color: '#2960D2' }}>{item.baseAmount} {item.unit}</Text>
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

  tabIcon: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
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
export default IngredientScreen;