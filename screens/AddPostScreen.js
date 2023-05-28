import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList, TouchableOpacity,Button,TextInput, Image, Alert, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AuthContext } from '../navigation/AuthProvider';
import { Picker } from '@react-native-picker/picker';
export default AddPostScreen= function({navigation}) {
    const [image,setimage] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [imageUrl,setimageUrl] = useState([]);
    const [FoodName, setFoodName] = useState("");
    const [Ingredient, setIngredient] = useState([]);
    const [Making, setMaking] = useState("");
    const [Summary, setSummary] = useState("");
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [defaultRating, setdefaulRating] = useState(0);
    const [maxRating, setmaxRating] = useState([1,2,3,4,5])
    const [hashtag, sethashtag] = useState([]);
    const [Total, setTotal] = useState("");
    const [Cal, setCal] = useState("");
    const [Prep, setPrep] = useState("");
    const [Cookingtime, setCookingtime] = useState("");

    const starImgFilled = "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
    const starImgCorner = "https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png";
    const {user} = useContext(AuthContext);
    const TextChangeFoodName = (Text)=>{setFoodName(Text)};
    const TextChangeIngredient = (text,index)=>{
      const i = Ingredient.findIndex(item => item.id === index);
      const newdata = [...Ingredient];
      newdata[i].name = text;
      setIngredient(newdata)};
    const TextChangeMaking = (Text)=>{setMaking(Text)};
    const TextChangeSummary= (Text)=>{setSummary(Text)};
    const TextChangetotal = (Text)=>{setTotal(Text)};
    const TextChangecal = (Text)=>{setCal(Text)};
    const TextChangeprep = (Text)=>{setPrep(Text)};
    const TextChangecooking= (Text)=>{setCookingtime(Text)};
    const CustomRatingBar = () => {
      return (
        <View style={styles.customRatingBarStyle}>
          {
            maxRating.map((item, key)=>{
              return (
                <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={()=> setdefaulRating(item)}>
                  <Image style={styles.starImgStyle}
                  source={item <= defaultRating ? {uri: starImgFilled} : {uri:starImgCorner}}/>
                </TouchableOpacity>
              )
            })
          }
        </View>
      )
    }
    const getfollower = async() => {
      await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        if( documentSnapshot.exists ) {
          setFollowers(documentSnapshot.data().followers);
        }
      })
    }
    useEffect(() => {
      getfollower();
     }, []);
    function allowPost()
    {
      if(image!=null || text !='')
      {
        return true;
      }
      return false;
    }
    const pickImageAsync = async () => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(img => {
        let image2 = image.slice();
        image2.push(img);
        setimage(image2);
      });
    };
    const submitPost = async() => {
      try {
        for(let i = 0; i < image.length; i++)
        {
          imageUrl[i] = await uploadImage(image[i].path);
        }
        for (let i = 0; i < Ingredient.length; i++)
        {
          if(Ingredient[i].dv == "") Ingredient[i].dv = "g";
        }
       // const imageUrl = await uploadImage();
        const docRef = await firestore().collection('posts').add({
          postId: null,
          userId: user.uid,
          postFoodName: FoodName,
          postFoodRating:defaultRating,       
          postFoodIngredient:Ingredient,  
          postFoodMaking:Making,  
          postFoodSummary:Summary,  
          postImg: imageUrl,
          total:Total,
          Calories:Cal,
          Prep:Prep,
          Cooking:Cookingtime,
          hashtags:hashtag,
          postTime: firestore.Timestamp.fromDate(new Date()),
          likes: [],
          comments: [],
          name: user.displayName,
          userImg: user.photoURL,
        });
        await firestore().collection('posts').doc(docRef.id).update({
          postId: docRef.id
        });
        console.log('post added');
        Alert.alert(
          'Post uploaded',
          'Your post has been upload to the Firebase Cloud Storage successfully!'
        );
        navigation.push('feedsScreen');
        for(let i = 0; i < followers.length; i++){
          firestore().collection('Notification').add({
            PostownerId: followers[i],
            guestId: auth().currentUser.uid,
            guestName: auth().currentUser.displayName,
            guestImg:auth().currentUser.photoURL,
            classify:'post',
            time:firestore.Timestamp.fromDate(new Date()),
            text: auth().currentUser.displayName+' đã đăng 1 bài viết về món ăn: '+ FoodName,
            postid: docRef.id,
            Read:'no',
  
          });
          SendNoti( auth().currentUser.displayName+' đã đăng 1 bài viết về món ăn: '+ FoodName, followers[i]);
        }
       
      } catch (error) {
        console.log('something went wrong!', error);
      }
    }
    
    const uploadImage = async (image)=>{
      if(image == null) return null;
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1);
        const extension = filename.split('.').pop();
         const name = filename.split('.').slice(0,-1).join('.');
         filename = name + Date.now() + '.' + extension;
       // console.log(filename);
        setTransferred(0);
        setUploading(true);
        const storageRef = storage().ref('photos/'+filename.toString());
        const task = storageRef.putFile(uploadUri);
        task.on('state_changed', taskSnapshot => {
          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
          setTransferred(
           Math(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes)*100
          )
        });
        try{
            await task;
            const url = await storageRef.getDownloadURL();
            setUploading(false);
            return url;

        } catch(e){
            console.log(e);
            return null;
        }
        setimage(null);

    }
   
    const [mainingredient, setmainingredient] = useState([
      {key:"Beans & Peas", tick: false}, {key:" Beef", tick: false}, {key:"Chicken", tick: false}, {key:"Egg", tick: false},{key: "Seafood", tick: false},{key: "Pork", tick: false},{key: "Pasta", tick: false}])
    const [diettype, setdiettype] =useState( [
        {key:"Low-Fat", tick: false},{key:"High-Protein", tick: false},{key:"Vegetarian", tick: false},{key:"Keto", tick: false},{key:"Mediterranean", tick: false},{key:"High-Fiber", tick: false}
    ]);
    const [mealtype, setmealtype] =useState( [
        {key:"Breakfast", tick: false},{key:"Lunch", tick: false},{key:"Dinner", tick: false},{key:"Snack", tick: false}
    ]);
    const [cookingstyle, setcookingstyle ]= useState([
        {key: "Fast Prep", tick: false}, {key:"No Cooking", tick: false}, {key:" Fast & Easy", tick: false}, {key:"Slow Cooker", tick: false}, {key:"Grilling", tick: false}
    ]);
    const [course, setcourse] = useState( [
        {key:"Salads & Dressings", tick: false}, {key:"Desserts", tick: false}, {key:"Sides", tick: false}, {key:"Beverages & Smoothies", tick: false},{key: "Soups & Stews", tick: false}
    ])
   
    const Hashtags = ({each})=>(
        <TouchableOpacity style={{backgroundColor:(each.tick)?'#9ACD32':'#E6E6FA', marginLeft:15, marginTop:10, alignItems:'center', borderRadius:15, borderColor:'#8470FF', borderWidth:1}}
        onPress={()=>{
          const index1 = mainingredient.findIndex(item => item === each);
          if(index1 != -1)
          {
            const newData = [...mainingredient];
            newData[index1].tick = !each.tick;
            setmainingredient(newData);
          }
          const index2 = course.findIndex(item => item === each);
          if(index2 != -1)
          {
            const newData = [...course];
            newData[index2].tick = !each.tick;
            setcourse(newData);
          }
          const index3 = cookingstyle.findIndex(item => item === each);
          if(index3 != -1)
          {
            const newData = [...cookingstyle];
            newData[index3].tick = !each.tick;
            setcookingstyle(newData);
          }
          const index4 = mealtype.findIndex(item => item === each);
          if(index4 != -1)
          {
            const newData = [...mealtype];
            newData[index4].tick = !each.tick;
            setmealtype(newData);
          }
          const index5 = diettype.findIndex(item => item === each);
          if(index5 != -1)
          {
            const newData = [...diettype];
            newData[index5].tick = !each.tick;
            setdiettype(newData);
          }
         if(hashtag.length>0)
         {
          let flag = false;
          for(let i = 0; i < hashtag.length; i++)
          {
            if(hashtag[i] == each.key){
              hashtag.splice(i, 1); 
                    flag = true;
                    break;
            }
          }
          if(flag==false)hashtag.push(each.key);
         }
         else hashtag.push(each.key);
        // console.log("size "+hashtag.length)
         
        }}>
            <Text style={styles.TextStyle}>{each.key}</Text>
        </TouchableOpacity>
        
    )
    const [options, setOp] = useState( [
        { label: 'g', value: 'g' },
        { label: 'kg', value: 'kg' },
        { label: 'ml', value: 'ml' },
        { label: 'l', value: 'l' },
        { label: 'cup', value: 'cup' },
        { label: 'teaspoon', value: 'tsp' },
        { label: 'tablespoon', value: 'tbsp' },
        { label: 'piece', value: 'piece' },
        { label: 'pieces', value: 'pieces' },
        // Add more options as needed
      ]);
    const [selectedValue, setSelectedValue] = useState();

  const handleChange = (value) => {
    setSelectedValue(value);
  };
    const Item = ( {itemI} ) => (
        <View style={{flexDirection:'column', height:100, backgroundColor:'#FFFAF0', width:"95%",alignSelf:'center'}}>
            <TouchableOpacity onPress={()=> {
                const newArray = Ingredient.filter(item => item.id !== itemI.id);
                let i = 0;
                newArray.map((each)=>{each.id = i; i=i+1;})
                setIngredient(newArray);          
            }}>
            <Icon name={'minus-circle'} style={{color: 'black', fontSize: 20, padding: 5}} />
          </TouchableOpacity>
             <View style={{flexDirection:'row', height:100, backgroundColor:'#FFFAF0', width:"100%", alignSelf:'center'}} >
            <TextInput  multiline={true} style={{ width:"50%", height:50, borderBottomColor:'black', borderBottomWidth:1}} onChangeText={(val)=>n = val}
                onEndEditing={()=>{itemI.name = n}}
                defaultValue={itemI.name}/>
            <Text>Wty:</Text>
            <TextInput style={{ width:"10%", height:50, borderBottomColor:'black', borderBottomWidth:1,textAlign:'center'}}onChangeText={(val)=>n = val}
                onEndEditing={()=>itemI.wty = n}
                defaultValue={itemI.wty}/>
            <Picker
        selectedValue={itemI.dv}
        onValueChange={(value)=> {itemI.dv = value, setSelectedValue(value), console.log(itemI)}}
        style={{height:50, width:120}}
      >
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>                
        </View>  
        </View>     
      );
   
      
    return (
      <View style={styles.container}>
        <View
          style={{
            // marginTop: 50,
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFF99',
          }}>
          <TouchableOpacity onPress={()=> navigation.navigate('feedsScreen')}>
            <Icon name={'arrow-left'} style={{color: 'black', fontSize: 30, padding: 5}} />
          </TouchableOpacity>

          <Text style={{fontSize: 20, flex: 1, marginLeft: 5}}>
            Tạo bài viết
          </Text>
          {uploading ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text>{transferred} % completed! </Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <Button
              title={'Đăng'}
              color={allowPost() == true ? '#FFCC00' : '#BBBBBB'}
              onPress={submitPost}
            />
          )}
          <View style={{marginRight: 5}} />
        </View>
       
        {selectedTab == 0 && (
          <>
          <KeyboardAvoidingView style={{}} behavior='height'>
              <ScrollView >
           <View
          style={{
            height: 70,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: '700',
              alignSelf: 'center',
            }}>
            Step 1. Something about food
          </Text>
        </View>
           <View style={styles.TextBox}>
           <Icon name={"pencil-alt"} style={{ color: "#FFCC00", fontSize: 30, marginLeft:340,position:"absolute" }} />
           <ScrollView>
             <Text style={[styles.TextStyle,{marginTop:20}]}>Food name</Text>
           <TextInput
             style={{fontSize: 16, 
                marginLeft: 3, 
                borderBottomColor:'black', 
                alignSelf:'center',
                borderBottomWidth:1, 
                width:"90%", }}
             value={FoodName}
             onChangeText={TextChangeFoodName}
           />
            <Text style={[styles.TextStyle,{marginTop:20}]}>level of difficulty</Text>
            <CustomRatingBar/>
            <View style={styles.InputBox}>
            <Text  style={styles.TextStyle}>Total</Text>
            <TextInput
             style={styles.InputStyle}
             value={Total}
             onChangeText={TextChangetotal}
           />
            <Text>servings</Text>
            </View>
            
            <View style={styles.InputBox}>
            <Text style={styles.TextStyle}>Calories</Text>
           <TextInput
             style={styles.InputStyle}
             value={Cal}
             onChangeText={TextChangecal}
           />
            <Text>cals/serving</Text>
            </View>
            <View style={styles.InputBox}>
            <Text style={styles.TextStyle}>Prep time</Text>
           <TextInput
             style={styles.InputStyle}
             value={Prep}
             onChangeText={TextChangeprep}
           />
            </View>
            <View style={styles.InputBox}>
            <Text style={styles.TextStyle}>Cooking time</Text>
           <TextInput
             style={styles.InputStyle}
             value={Cookingtime}
             onChangeText={TextChangecooking}
           />
            </View>
           </ScrollView>
 
           </View>  
           </ScrollView>
           </KeyboardAvoidingView>
           </>  
        ) }
        {(selectedTab==1)&& (
            <>
            <KeyboardAvoidingView style={{}} behavior='height'>
              <ScrollView>
          <View
          style={{
            height: 70,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: '700',
              alignSelf: 'center',
            }}>
            Step 2. How to make food?
          </Text>
        </View>
           <View style={styles.TextBox}>
            <ScrollView>
            <View style={{flexDirection:'row'}}>
            <Text style={[styles.TextStyle,{marginTop:20}]}>What ingredients are there?</Text>
           <TouchableOpacity onPress={()=>{
             const newData = [
                ...Ingredient,
                { id:Ingredient.length,name:"", wty:"", dv:"" },
              ];
            setIngredient(newData);
           }}>
          <Icon
              name={'cart-plus'}
              style={{
                marginLeft:15,
                color: 'green',
                marginTop:10,
                fontSize: 40 
              }}
            /> 
          </TouchableOpacity>

            </View>
           <FlatList
        data={Ingredient}
        renderItem={({item})=><Item itemI={item} />}
        keyExtractor={(item, index) => index.toString()}
         />
       <Text style={[styles.TextStyle,{marginTop:20}]}>Give me the recipe of your food</Text>
           <TextInput
           multiline={true}
             style={{fontSize: 16, 
                marginLeft: 3, 
                borderBottomColor:'black', 
                alignSelf:'center',
                borderBottomWidth:1, 
                width:"90%", }}
                value={Making}
             onChangeText={TextChangeMaking}
           />
           <Text style={[styles.TextStyle,{marginTop:20}]}>Do you want to say something?</Text>
           <TextInput
           multiline={true}
             style={{fontSize: 16, 
                marginLeft: 3, 
                borderBottomColor:'black', 
                alignSelf:'center',
                borderBottomWidth:1, 
                width:"90%", }}
                value={Summary}
             onChangeText={TextChangeSummary}
           />
        </ScrollView>

           </View>
           </ScrollView>
           </KeyboardAvoidingView>
           </>
        )}
        {(selectedTab==2)&&(
            <>
           <View
          style={{
            height: 70,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: '700',
              alignSelf: 'center',
            }}>
            Step 3. Choose hashtags
          </Text>
        </View>
           <View style={styles.TextBox}>
            <ScrollView>
            <Text style={[styles.TextStyle,{marginTop:20}]}>Meal Type</Text>
            <FlatList
        data={mealtype}
        renderItem={({item})=><Hashtags each={item} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
            <Text style={[styles.TextStyle,{marginTop:20}]}>Cooking Style</Text>
            <FlatList
        data={cookingstyle}
        renderItem={({item})=><Hashtags each={item} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
            <Text style={[styles.TextStyle,{marginTop:20}]}>Course</Text>
            <FlatList
        data={course}
        renderItem={({item})=><Hashtags each={item} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
            <Text style={[styles.TextStyle,{marginTop:20}]}>Main Ingredient</Text>
            <FlatList
        data={mainingredient}
        renderItem={({item})=><Hashtags each={item} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
            <Text style={[styles.TextStyle,{marginTop:20}]}>Diet Type</Text>
            <FlatList
        data={diettype}
        renderItem={({item})=><Hashtags each={item} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
      <View style={{height:50, width:"100%"}}/>
            </ScrollView>
            </View>
            </>
        )}
        {(selectedTab==3)&&(
            <View style={{height: 560, flexDirection: 'column'}}>  
          {image.length==0? (
            <View>
              <Image
                source={require('../assets/MonAn.jpg')}
                style={{
                  width: 300,
                  height: 200,
                  borderRadius: 15,
                  alignSelf: 'center',
                  marginTop: 150,
                }}
              />
              <Text style={{alignSelf: 'center'}}>
                Thêm hình ảnh mà bạn thích
              </Text>
            </View>
          ) : null}
          <ScrollView style={{flexDirection:'column' }}>
            {
              image.map((each,key)=>{
                return(  
                    <View key={key} >
                      <Image source={{uri:each.path}} style={{height:200, width:400, marginTop:5}} resizeMode='cover'/>
                      <TouchableOpacity style={{ marginTop:3, position:'absolute'}} onPress={()=>{
                        let filterRssult=image.filter(function(element){
                          return element !== each;
                        })
                        setimage(filterRssult);
                       }}>
                       <Icon name={"backspace"} style={{ color: "#FFCC00", fontSize: 25 }} />
                     </TouchableOpacity>
                    </View>     
                );
              })
             
            }
  
          </ScrollView>
          <TouchableOpacity onPress={pickImageAsync}>
          <Icon
              name={'images'}
              style={{
                marginLeft: 300,
                color: 'green',
                fontSize: 50,
                alignSelf: 'center',
              }}
            /> 
          </TouchableOpacity>
        </View>
        )} 
       
        <View style={styles.Wrapper}>
          <TouchableOpacity
            style={{
              height: 42,
              flexDirection: 'row',
            }}
            onPress={()=>{ 
                if(selectedTab > 0){
                    setSelectedTab(selectedTab-1);    
                }}}>
               <Icon
              name={'hand-point-left'}
              style={{
                marginLeft: 15,
                color: 'green',
                fontSize: 30,
                alignSelf: 'center',
              }}
            />
            
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 42,
              flexDirection: 'row',
            }}
            // onPress={pickImageAsync}
        onPress={()=>{
            if(selectedTab < 3){
                setSelectedTab(selectedTab+1);
            }}}>
             <Icon
              name={'hand-point-right'}
              style={{
                marginRight: 15,
                color: 'green',
                fontSize: 30,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
}
const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: '#fff',
    },
    TextBox:{
      height:490,
      width:"95%", 
      borderColor:"black", 
      borderWidth:1, 
      borderRadius:20, 
      marginLeft:10,
    },
    TextStyle:
    {
      fontSize: 18, 
      marginLeft: 6,
      color:"black",
      fontWeight:"600"
    },
    InputStyle:{
        fontSize: 16, 
        marginLeft: 3, 
        borderBottomColor:'black', 
        borderBottomWidth:1, 
        width:"40%", 
        textAlign:'center'
    },
    InputBox:{
        flexDirection:'row', 
        marginTop:20, 
        height:50, 
        alignItems:'center'
    },
    Wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    //   alignItems:'center',
      width: '100%',
      marginTop: 10,
      backgroundColor: '#FFCC00'
    },
    customRatingBarStyle:{
      flexDirection:"row",
      marginLeft:6,
      marginTop:5
    },
    starImgStyle:{
      width:30,
      height:30,
      resizeMode:'cover'
    }

  })