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
    image: 'https://media.istockphoto.com/id/685772628/photo/raw-organic-fresh-green-fava-beans.jpg?s=612x612&w=0&k=20&c=Mf8j77IE_KjFxkl84J-UheJmokrzfrP4gptyC6mQ7J8=', 
    name: 'Lentils raw', 
    calories: '176', unit:'g', baseAmount:'50', fat: '1', carbs: '32', protein: '12'
    },
    {
      image: 'https://www.pngkit.com/png/full/46-466335_yellow-split-peas-png.png', 
      name: 'Yellow split peas raw', 
      calories: '524', unit:'g', baseAmount:'144', fat: '6', carbs: '89', protein: '33'
      },
      {
        image: 'https://cdn-icons-png.flaticon.com/512/723/723523.png', 
        name: 'Water', 
        calories: '0', unit:'cup', baseAmount:'1', fat: '0', carbs: '0', protein: '0'
        },
      {
        image: 'https://daylambanh.edu.vn/wp-content/uploads/2019/06/cottage-cheese-la-gi.jpg', 
        name: 'Cottage cheese low fat 1% milkfat', 
        calories: '163', unit:'cup', baseAmount:'1', fat: '2', carbs: '6', protein: '28'
        },
      {
        image: 'https://cdn-icons-png.flaticon.com/512/1625/1625122.png',
        name: 'Tofu', 
        calories: '144', unit:'g', baseAmount:'100', fat: '9', carbs: '3', protein: '17'
        },
        {
          image: 'https://file.hstatic.net/1000282430/article/ph_n_bi_t_8_lo_i_ph__mai_ph__bi_n_nh_t_9b7f3bda12d54ac28719e1262b5ef782_1024x1024.jpg',
          name: 'Goat cheese hard', 
          calories: '90', unit:'g', baseAmount:'20', fat: '7', carbs: '0', protein: '6'
          },
        {
          image: 'https://vinmec-prod.s3.amazonaws.com/images/20210613_080410_028442_cach-tri-mun-dau-de.max-1800x1800.jpg',
          name: 'Egg white raw', 
          calories: '34', unit:'large', baseAmount:'2', fat: '0', carbs: '0', protein: '7'
          },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Bowl-of-rice_icon.svg/948px-Bowl-of-rice_icon.svg.png', 
    name: 'Rice', 
    calories:'130', unit:'bowl', baseAmount:'1', fat: '0', carbs: '28', protein: '2' 
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Turkish_strained_yogurt.jpg/640px-Turkish_strained_yogurt.jpg', 
    name: 'Yogurt plain whole milk', 
    calories:'149', unit:'cup', baseAmount:'1', fat: '8', carbs: '11', protein: '9' 
  },
  
  {
    image: 'https://file.medinet.gov.vn//UploadImages/tytphuong9qgv/an-trung-bi-ngo-doc-8-1637513372840917017780.jpg?w=900',
    name: 'Egg yolk raw', 
    calories: '55', unit:'large', baseAmount:'1', fat: '5', carbs: '1', protein: '3'
    },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/684/684631.png', 
    name: 'Milk whole 3.25% milkfat', 
    calories:'149', unit:'cup', baseAmount:'1', fat: '8', carbs: '12', protein: '8' 
  },
  {
    image: 'https://img.freepik.com/premium-vector/raw-chicken-breast-fillet-wooden-cutting-board_694196-151.jpg', 
    name: 'Chicken breast raw', 
    calories:'216', unit:'g', baseAmount:'200', fat: '6', carbs: '0', protein: '41' 
  },
  {
    image: 'https://www.thepurposefulpantry.com/wp-content/uploads/2021/05/boil-hamburger-feat-1.jpg', 
    name: 'Beef ground', 
    calories:'168', unit:'g', baseAmount:'85', fat: '11', carbs: '0', protein: '17' 
  },
  {
    image: 'https://www.ayumi.co.uk/wp-content/uploads/2020/06/Ayumi_Products_900x900_OliveOil1_v5.jpg', 
    name: 'Olive oil', 
    calories:'40', unit:'tsp', baseAmount:'1', fat: '5', carbs: '0', protein: '0' 
  },
  {
    image: 'https://cdn.tgdd.vn/2021/07/CookProductThumb/100gr-thit-heo-bao-nhieu-calo-an-thit-heo-co-tot-khong-va-luu-y-khi-an-1b-620x620.jpg', 
    name: 'Pork raw', 
    calories:'242', unit:'g', baseAmount:'100', fat: '14', carbs: '0', protein: '27' 
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
    image: 'https://assets.mynetdiary.com/SystemPictures/web/14201.webp?1553628', 
    name: 'Coffee black no sugar', 
    calories: '2', unit:'cup', baseAmount:'1', fat: '1', carbs: '0', protein: '0'
    },
    {
      image: 'https://www.richs.com.vn/images/Blog/Trends/cream-cheese-pho-mai-con-bo-cuoi-cach-lam/cream_cheese_pho_mai_con_bo_cuoi%20-%20Copy%201.jpg', 
      name: 'Cream cheese', 
      calories: '51', unit:'tbsp', baseAmount:'1', fat: '5', carbs: '1', protein: '1'
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
    image: 'https://media.istockphoto.com/id/1251655603/vector/illustration-of-canned-tuna.jpg?s=612x612&w=0&k=20&c=YPEuE1upoqnC5DXXABpZc9ZaPOpgOEJcUuskI4COEsY=', 
    name: 'Tuna light canned in oil', 
    calories: '339', unit:'can', baseAmount:'1', fat: '2', carbs: '0', protein: '32'
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
    image: 'https://www.mashed.com/img/gallery/the-side-effect-that-will-make-you-want-to-eat-more-liver/intro-1611519051.jpg', 
    name: 'Beef liver raw', 
    calories: '135', unit:'g', baseAmount:'100', fat: '4', carbs: '4', protein: '20'
    },
    {
      image: 'https://media.istockphoto.com/id/685772628/photo/raw-organic-fresh-green-fava-beans.jpg?s=612x612&w=0&k=20&c=Mf8j77IE_KjFxkl84J-UheJmokrzfrP4gptyC6mQ7J8=', 
      name: 'Fava beans raw', 
      calories: '341', unit:'g', baseAmount:'100', fat: '2', carbs: '58', protein: '26'
      },
  {
    image: 'https://png.pngtree.com/png-vector/20221123/ourmid/pngtree-lemon-icon-png-image_6477461.png', 
    name: 'Lemon raw', 
    calories: '17', unit:'fruit', baseAmount:'1', fat: '0', carbs: '5', protein: '1'
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
        Alert.alert('Input cannot be blank')
      }
      else{
        
          const resultCalories = (parseFloat(textSearch) * parseInt(calories) / parseInt(baseAmount)).toFixed();
          const _fat = (parseFloat(textSearch) * parseInt(fat) / parseInt(baseAmount)).toFixed();
          const _carbs = (parseFloat(textSearch) * parseInt(carbs) / parseInt(baseAmount)).toFixed();
          const _protein = (parseFloat(textSearch) * parseInt(protein) / parseInt(baseAmount)).toFixed();
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
            style={{height: 120, width: 120, marginVertical: 10, resizeMode: 'stretch'}}
          />
        <View style={{marginStart: 15, marginVertical: 5}}>
            <Text style={{fontSize: 15, width: 150}}>{name}</Text>
            <Text style={{fontSize: 15}}>{calories} cals/{(baseAmount!='1')?baseAmount+" ":''}{unit}</Text>
            <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 13, color: '#5ADFC8'}}>{language==='vn'?'Đường: ':'Carbs: '} </Text>
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
        <TextInput 
        keyboardType = 'number-pad'
        onChangeText={textSearch=>{
                    if (+textSearch||textSearch== "") {
                      onChangeTextSearch(textSearch)
                    }
                    
                    }}  style={[styles.textInput, {width: 220}]} value={textSearch}/>
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