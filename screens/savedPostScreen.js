import React, {useContext, useEffect, useState} from "react";
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,Image, ActivityIndicator, Alert} from 'react-native';
import { AuthContext } from '../navigation/AuthProvider'
import TabContainer from "../components/TabContainer"
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import LanguageContext from "../context/LanguageContext";
import CheckBox from '@react-native-community/checkbox'
import ThemeContext from "../context/ThemeContext";

const savedPostScreen = ({navigation}) => {
    const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
    const [savedPlist, setSavedPlist] = useState([]);
    const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5]);
    const starImgFilled =
      'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true';
    const starImgCorner =
      'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';
    const CustomRatingBar = ({defaultRating}) => {
      //console.log("df" + defaultRating)
      return (
        <View style={styles.customRatingBarStyle}>
          {maxRating.map((item, key) => {
            return (
              <Image
                key={key}
                style={styles.starImgStyle}
                source={
                  item <= defaultRating
                    ? {uri: starImgFilled}
                    : {uri: starImgCorner}
                }
              />
            );
          })}
        </View>
      );
    };
    const getsavedPostId = async () => {
      await firestore()
        .collection('SavedPosts')
        .doc(auth().currentUser.uid)
        .get()
        .then(doc => {
          getsavedPost(doc.data().postIds);
        });
    };
    const getsavedPost = async List => {
      const list = [];
      for (let i = 0; i < List.length; i++) {
        await firestore()
          .collection('posts')
          .where('postId', '==', List[i])
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              const {
                userId,
                postFoodName,
                postFoodRating,
                postFoodMaking,
                postFoodIngredient,
                postFoodSummary,
                postImg,
                postTime,
                comments,
                likes,
                name,
                userImg,
                total,
                Calories,
                Prep,
                Cooking,
                hashtags,
              } = doc.data();
              var Time =
                new Date(postTime._seconds * 1000).toDateString() +
                ' at ' +
                new Date(postTime._seconds * 1000).toLocaleTimeString();
              list.push({
                postId: doc.id,
                userId: userId,
                userName: name,
                userImg: userImg,
                postTime: Time,
                postFoodName: postFoodName,
                postFoodRating: postFoodRating,
                postFoodIngredient: postFoodIngredient,
                postFoodMaking: postFoodMaking,
                postFoodSummary: postFoodSummary,
                total: total,
                Calories: Calories,
                Prep: Prep,
                Cooking: Cooking,
                hashtags: hashtags,
                postImg: postImg,
                likes: likes,
                comments: comments,
                liked: false,
              });
            });
          });
      }
      // await new Promise((resolve) => {
      //   setTimeout(resolve, 1000);
      // });
      setSavedPlist(list);
    };
    useEffect(() => {;
        getsavedPostId();
      }, []);
    return(
    <View style={[styles.container, {backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}]}>
    <View style={{height: 50, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#DDD', borderBottomWidth: 1}}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons 
            name="arrow-back"
            size={28}
            backgroundColor='transparent'
            color={theme === 'light'? '#000' : '#fff'}                          
            />
    </TouchableOpacity>
      <Text style={{fontSize: 20 , marginStart: 5 ,color: theme === 'light'? '#000' : '#fff'}}>
      {language === 'vn' ?"Những bài viết đã lưu":"Saved Posts"}
      </Text>
    </View>
    <ScrollView style={{flexDirection: 'column'}}>
              {savedPlist.map((item, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    style={{
                      backgroundColor:
                        theme === 'light' ? '#FFFAF0' : '#4F4F4F',
                      width: '100%',
                      height: 100,
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 3,
                    }}
                    onPress={() =>
                      navigation.push('gotoPost', {postid: item.postId})
                    }>
                    <Image
                      style={styles.UserImage}
                      source={{
                        uri:
                          item.postImg.length > 0
                            ? item.postImg[0]
                            : 'http://getwallpapers.com/wallpaper/full/2/3/6/153929.jpg',
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        marginLeft: 20,
                        width: '60%',
                      }}>
                      <Text style={styles.userName}>{item.postFoodName}</Text>
                      <Text style={styles.calories}>
                        {item.Calories + ' cals/serving'}
                      </Text>
                      <CustomRatingBar defaultRating={item.postFoodRating} />
                    </View>
                
                      <TouchableOpacity
                        style={styles.DeleteButton}
                        onPress={() => {
                          const filteredData = savedPlist.filter(
                            i => i.postId !== item.postId,
                          );
                          setSavedPlist(filteredData);
                          const list = [];
                          for (let i = 0; i < filteredData.length; i++) {
                            list.push(filteredData[i].postId);
                          }
                          const collectionRef =
                            firestore().collection('SavedPosts');
                          const documentRef = collectionRef.doc(
                            auth().currentUser.uid,
                          );
                          documentRef.set({postIds: list});
                          Alert.alert(
                            'Success',
                            'You have successfully removed the post from the list',
                          );
                        }}>
                        <Icon
                          name={'times-circle'}
                          size={28}
                          backgroundColor="transparent"
                          color={theme === 'light' ? '#000' : '#EEE9E9'}
                        />
                      </TouchableOpacity>
                    
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
    </View>
    )
}
export default savedPostScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection:'column',
      backgroundColor:'#fff',
      padding: 5
    },
    textfont:{
      fontSize: 17,
      marginLeft: 5, 
      color: 'black'
    },
    row:
    {
      height:50, 
      backgroundColor:'#FFFAF0',
      flexDirection:'row',
      marginTop:10,
      alignItems:'center'
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
      },
      calories: {
        fontSize: 14,
        marginBottom: 10,
      },
      customRatingBarStyle: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      starImgStyle: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
      },
      DeleteButton: {
        marginLeft: '5%',
      },
      UserImage: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginLeft: 10,
      },
   
})