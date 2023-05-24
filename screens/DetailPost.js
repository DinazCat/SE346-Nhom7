import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,Image, alert} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import PostCard from '../components/PostCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';

export default function DetailPostScreen({navigation,route}) {
    const [postData, setPost] = useState(null);
    const [posttime, setPtime] = useState('');
    const [defaultRating, setdefaulRating] = useState();
    const [maxRating, setmaxRating] = useState([1,2,3,4,5])
    const starImgFilled = "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
    const starImgCorner = "https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png";
    const {postId} = route.params;
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
        <View style={styles.Container}>
            <View style={styles.UserInfoContainer}>
                <TouchableOpacity onPress={onUserPress}>
                    <Image style={styles.UserImage} source={{uri: postData?  postData.userImg : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'}}/>
                </TouchableOpacity>            
                <View style={styles.UserInfoTextContainer}>
                    <TouchableOpacity onPress={onUserPress}>
                        <Text style={styles.UsernameText}>{postData?  postData.name : ''}</Text>
                    </TouchableOpacity>                
                    <Text style={styles.PostTime}>{postData?  posttime: ''}</Text>
                </View>
            </View>
    
        <View style={[styles.Container,{height:650}]}>
            <ScrollView style={{flexDirection:'column'}}>
                
                    <>
                     <View style={{flexDirection:"row"}}>
                     <Text style={styles.PostTitle}>Tên món ăn:</Text>
                     <Text style={styles.PostText}>{postData? postData.postFoodName:""}</Text>
                     </View>
                     <View style={{flexDirection:"row"}}>
                     <Text style={styles.PostTitle}>Độ khó:</Text>
                     <CustomRatingBar/>
                     </View>
                     <Text style={styles.PostTitle}>Nguyên liệu:</Text>
                     <Text style={styles.PostText}>{postData?postData.postFoodIngredient:""}</Text>
                     <Text style={styles.PostTitle}>Cách làm:</Text>
                     <Text style={styles.PostText}>{postData?postData.postFoodMaking:""}</Text>
                     <Text style={styles.PostTitle}>Tổng kết:</Text>
                     <Text style={styles.PostText}>{postData?postData.postFoodSummary:""}</Text>
                     
               { postData?.postImg.map((each,key)=>{
                    return(  
                        <View key={key}>
                        <Image source={{uri:each}} style={{height:300, width:400, marginTop:5}} resizeMode='cover'/>
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
            backgroundColor: '#1C1C1C',
            width: '100%',
            marginBottom: 10,
            borderRadius: 5,
        },
        UserInfoContainer:{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 5,
        },
        UserImage:{
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        UserInfoTextContainer:{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: 5,
        },
        UsernameText:{
            fontSize: 14,
            fontWeight: 'bold',
            color:"white",
            fontFamily: 'Lato-Regular',
        },
        PostTime:{
            fontSize: 12,
            color:"white",
            fontFamily: 'Lato-Regular',
            color: '#666',
        },
        PostText:{
            fontSize: 14,
            fontFamily: 'Lato-Regular',
            color:"white",
            paddingHorizontal: 15,
            marginBottom: 15,
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
            fontSize: 16,
            fontFamily: 'Lato-Regular',
            paddingHorizontal: 15,
            marginBottom: 10,
            fontWeight:"600",
            color:"white"
        },
        customRatingBarStyle:{
            flexDirection:"row",
            marginLeft:12,
            marginBottom: 10,
            paddingHorizontal: 15,
        },
        starImgStyle:{
            width:20,
            height:20,
            resizeMode:'cover'
        },
    
    })
