import { StyleSheet, Text, View, Image, TouchableOpacity, Modal,alert } from 'react-native'
import React, { useEffect, useRef, useState, useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PostCard from '../components/PostCard';
import ThemeContext from '../context/ThemeContext';
export default GotoPostScreen = ({navigation,route}) =>{
    const [item, setitem] = useState()
    const [done, setdone] = useState(false);
    const theme = useContext(ThemeContext)
    const getPost = () => {
        firestore()
          .collection('posts')
          .doc(route.params.postid)
          .get()
          .then(documentSnapshot => {
            const {userId,postFoodName, postFoodRating, postFoodMaking, postFoodIngredient, postFoodSummary, postImg, postTime, comments,likes,name,userImg,} = documentSnapshot.data();
            var Time = new Date(postTime._seconds * 1000).toDateString() + ' at ' + new Date(postTime._seconds * 1000).toLocaleTimeString()
            const i ={
                    postId: route.params.postid,
                    userId: userId,
                    userName: name,
                    userImg: userImg,
                    postTime: Time,
                    postFoodName: postFoodName,
                    postFoodRating: postFoodRating,
                    postFoodIngredient:postFoodIngredient,
                    postFoodMaking: postFoodMaking,
                    postFoodSummary: postFoodSummary,
                    postImg: postImg,
                    liked: true,
                    likes: likes,
                    comments: comments,
                    liked: false,
                };
            
            setitem(i);
            setdone(true);
            console.log(i.postFoodRating);
          });
      };
      useEffect(() => {
        getPost();
      }, []);
    
    return(
      <View style={{flexDirection:'column', backgroundColor: theme === 'light'? '#FFFFFF' : '#000000', flex: 1}}>
        <View style={{flexDirection:'column'}}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Icon name={'arrow-left'} style={{color: theme === 'light'? '#000' : '#fff', fontSize: 30, padding: 5}} />
          </TouchableOpacity>
                {  (done)&&<PostCard  item={item}/>}

        </View>
        </View>
    )
}