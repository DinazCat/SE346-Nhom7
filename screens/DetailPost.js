import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,Image, alert} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import PostCard from '../components/PostCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import LanguageContext from "../context/LanguageContext";
import ThemeContext from '../context/ThemeContext';

export default function DetailPostScreen({navigation,route}) {
    const [postData, setPost] = useState(null);
    const [posttime, setPtime] = useState('');
    const [defaultRating, setdefaulRating] = useState();
    const [maxRating, setmaxRating] = useState([1,2,3,4,5])
    const starImgFilled = "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
    const starImgCorner = "https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png";
    const {postId} = route.params;
    const language = useContext(LanguageContext);
    const theme = useContext(ThemeContext);
    onUserPress=() => navigation.navigate('profileScreen', {userId: postData.userId})
    const Item = ({each}) => (
        <Image style={[styles.PostImgsContainer, {height: each ? 250 : 0}]} 
        source={{uri:each}} />
      );
      const CustomRatingBar = () => {
        return (
          <View style={styles.customRatingBarStyle}>
            {
              maxRating.map((item, key)=>{
                return (
                    <Image key={key} style={styles.starImgStyle}
                    source={item <= defaultRating ? {uri: starImgFilled} : {uri:starImgCorner}}/>
                )
              })
            }
          </View>
        )
      }

    const getPost = async() => {
        await firestore()
        .collection('posts')
        .doc(postId)
        .get()
        .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            setPost(data);
            setdefaulRating(documentSnapshot.data().postFoodRating);
            var Time = new Date(documentSnapshot.data().postTime._seconds * 1000).toDateString() + ' at ' + new Date(documentSnapshot.data().postTime._seconds * 1000).toLocaleTimeString();
            setPtime(Time);
           // console.log('Data fetched:', defaultRating);
        } else {
            console.log('Document does not exist');
            console.log(postId);
        }
        })
        .catch((error) => {
            console.log('Error getting document:', error);
            console.log(postId);
        });
    }
    useEffect(()=>{
        getPost();
      },[postId])
    return (
        <View style={[styles.Container, {backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}]}>
            <View style={styles.headerContainer}>
            <View style={styles.UserInfoContainer}>
                        <TouchableOpacity onPress={onUserPress}>
                            <Image style={styles.UserImage} source={{uri: postData?  postData.userImg ? postData.userImg : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png' : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'}}/>
                        </TouchableOpacity>            
                        <View style={styles.UserInfoTextContainer}>
                            <TouchableOpacity onPress={onUserPress}>
                                <Text style={[styles.UsernameText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{postData?  postData.name : ''}</Text>
                            </TouchableOpacity>                
                            <Text style={styles.PostTime}>{postData?  posttime: ''}</Text>
                        </View>
                    </View>
                <Text style={[styles.foodname, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{postData? postData.postFoodName:""}</Text> 
            </View>
            
            
        <View style={[styles.Container,{height:650, backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}]}>
            <ScrollView style={{flexDirection:'column'}}>               
                    <>
                    <View style={styles.userInfoWrapper}>
                        <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{postData?postData.total:""}</Text>
                        <Text style={styles.userInfoSubTitle}>Servings</Text>
                        </View>
                        <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{postData?postData.Prep:""}</Text>
                        <Text style={styles.userInfoSubTitle}>Prep</Text>
                        </View>
                        <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{postData?postData.Cooking:""}</Text>
                        <Text style={styles.userInfoSubTitle}>Cooking</Text>
                        </View>                                   
                    </View>     
                    <View style={styles.userInfoWrapper}>
                        <View style={styles.userInfoItem}>
                        <Text style={styles.userInfoTitle}>{postData?postData.Calories:""}</Text>
                        <Text style={styles.userInfoSubTitle}>Cal/serving</Text>
                        </View>
                        <View style={styles.userInfoItem}>
                        <CustomRatingBar/>
                        <Text style={styles.userInfoSubTitle}>Difficulty</Text>
                        </View>                              
                    </View>              
                     <View style={styles.split}/>
                     <View style={{backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}}>
                     <Text style={[styles.PostTitle, {color: '#5AC30D'}]}>{language === 'vn' ? 'Nguyên liệu' : 'Ingredients'}</Text>
                     {/* <Text style={styles.PostText}>{postData?postData.postFoodIngredient:""}</Text> */}
                     {
                        postData?.postFoodIngredient.map((each,key)=>{
                            return(
                                    <Text style={[styles.PostText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]} key={key}>{"- "+each.name + " ("+ each.wty+" "+ each.dv+")"}</Text>
                            )
                        })
                     }
                     </View>
                     <View style={styles.split}/>
                     <View style={{backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}}>
                     <Text style={[styles.PostTitle, {color: '#CE3E3E'}]}>{language === 'vn' ? 'Cách làm' : 'Steps'}</Text>
                     <Text style={[styles.PostText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{postData?postData.postFoodMaking:""}</Text>
                     </View>
                     <View style={styles.split}/>
                     <View style={{backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}}>
                     <Text style={[styles.PostTitle, {color: '#546ED5'}]}>{language === 'vn' ? 'Tổng kết' : 'Summary'}</Text>
                     <Text style={[styles.PostText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}>{postData?postData.postFoodSummary:""}</Text>
                     </View>
                     <View style={styles.split}/>
                     <View style={{backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}}>
                     <Text style={[styles.PostTitle, {color: '#23D8A3'}]}>Tag</Text>
                     {
                        postData?.hashtags.map((each,key)=>{
                            return(
                                <Text style={[styles.PostText, {color: theme === 'light'? '#000000' : '#FFFFFF'}]} key={key}>{"#"+each}</Text>
                            )
                        })
                     }
                     </View>
                     
               { postData?.postImg.map((each,key)=>{
                    return(  
                        <View key={key}>
                        <Image source={{uri:each}} style={{height:270, width:400, marginTop:5, borderRadius: 7}} resizeMode='cover'/>
                        </View>     
                    );
                })}
                </>
                              
            </ScrollView>
        </View>      
    </View>
    )
}
    
  
    const styles = StyleSheet.create({
        Container:{
            width: '100%',
            marginBottom: 10,
            borderRadius: 5,
            backgroundColor: '#fff',
            padding: 5,
        },
        foodname:{
            fontSize: 50,
            textAlign: 'center',
            color: '#000',
            fontFamily: 'WishShore',
        },
        headerContainer:{
            paddingVertical: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#DDD',
        },
        
        UserInfoContainer:{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 5,
            
        },
        UserImage:{
            width: 46,
            height: 46,
            borderRadius: 23,
        },
        UserInfoTextContainer:{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: 5,
        },
        UsernameText:{
            fontSize: 16,
            fontWeight: 'bold',
        },
        PostTime:{
            fontSize: 13,
            color:"white",
            color: '#888',
        },
        PostText:{
            fontSize: 16.5,
            paddingHorizontal: 15,
            marginBottom: 5,
            color:'black',
        },
        PostImgsContainer:{
            width: '100%', 
        
        },
        PostImage:{
    
        },
        devider:{
            borderBottomColor: '#DDDDDD',
            borderBottomWidth: 1,
            width: '92%',
            alignSelf: 'center',
            marginTop: 15,
        },
        InteractionContainer:{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 15,
        },
        Interaction:{
            flexDirection: 'row',
            justifyContent: 'center',
            borderRadius: 5,
            paddingVertical: 2,
            paddingHorizontal: 5,
        },
        InteractionText:{
            fontSize: 12,
            fontFamily: 'Lato-Regular',
            fontWeight: 'bold',
            marginTop: 5,
            marginLeft: 5,
        },
        PostTitle:{
            fontSize: 18,
            fontFamily: 'Lato-Regular',
            paddingHorizontal: 15,
            marginBottom: 10,
            fontWeight:"900",
            marginTop: 2,
        },
        customRatingBarStyle:{
            flexDirection:"row",
            marginBottom: 10,
        },
        starImgStyle:{
            width:20,
            height:20,
            resizeMode:'cover'
        },
        split: {
            height: 1,
            backgroundColor: '#DDD',
            marginVertical: 10,
            marginHorizontal: 5
        },
        userInfoWrapper: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            marginVertical: 15,
          },
          userInfoItem: {
            justifyContent: 'center',
            width: 100,
            borderRadius: 5,
            paddingVertical: 2,
          },
          userInfoTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 5,
            textAlign: 'center',
            color: '#E8B51A'
          },
          userInfoSubTitle: {
            fontSize: 13,
            color: '#666',
            textAlign: 'center',
          },
    })
