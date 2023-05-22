import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,Image, ActivityIndicator, RefreshControl} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';
import PostCard from '../components/PostCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'react-native';


export default function FeedsScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts]= useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setrefreshing] = useState(true);
  const [mark, setmark] = useState(false);
  const fetchPosts = async()=>{
    try{
      const list = [];
      await firestore()
      .collection('posts')
      .orderBy('postTime', 'desc')
      .get()
      .then((querySnapshot)=>{
        querySnapshot.forEach(doc =>{
          const {userId,postFoodName, postFoodRating, postFoodMaking, postFoodIngredient, postFoodSummary, postImg, postTime, comments,likes,name,userImg,} = doc.data();
          var Time = new Date(postTime._seconds * 1000).toDateString() + ' at ' + new Date(postTime._seconds * 1000).toLocaleTimeString()
          list.push({          
            postId: doc.id,
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
          });
        })

      })
      setPosts(list);
      setrefreshing(false);
      if(loading){ setLoading(false) };
    } catch(e){
      console.log(e);
    }
  }
  const getMark= async()=>
  {
    await firestore()
    .collection('Notification')
    .get()
    .then((querySnapshot)=>{
      querySnapshot.forEach(doc =>{
      const {PostownerId, Read,} = doc.data();
      if(PostownerId == auth().currentUser.uid)
      {
        if(Read == 'no')
        {
         setmark(true);
        }
      }
      })
    })
    
  }
  useEffect(()=>{
    fetchPosts();
    getMark();
    const openPostDetailScreen = async (event) => {
      const { url } = event;
      const postId = url.split('?postId=')[1];
      navigation.navigate('detailScreen', { postId: postId });
    };
    Linking.addEventListener('url', openPostDetailScreen);

    return () => {
      Linking?.removeEventListener?.('url', openPostDetailScreen);
    };
  },[])
  

  const handleCommentChanged = () => {
    fetchPosts();
  };
  const onRefresh=()=>{
    setPosts([]);
    fetchPosts();
    getMark();
  
  }
  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}/>
      <TouchableOpacity onPress={() => navigation.push("searchScreen")}>
            <Icon name={'search'} style={styles.ButtonSearch} />
       </TouchableOpacity>
       <TouchableOpacity onPress={() => {navigation.push("nofiScreen"), setmark(false)}}>
        <View>
            <Icon name={'bell'} style={styles.ButtonSearch} />
           {(mark)&&<FontAwesome name="circle" style={styles.smallcircle}/>}
        </View>        
       </TouchableOpacity>

      </View>
      
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => { console.log(user);
          navigation.navigate('profileScreen', {userId: user.uid})}}>
          <Image style={styles.UserImage} source={{uri: user.photoURL}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.push('addPostScreen')}>
          <View style={styles.addPostTextContainer}>
            <Text>What did you eat today? Share with everyone</Text>
          </View>          
        </TouchableOpacity>
      </View>
      
      <View style={{flex:1}}>
        {refreshing ? <ActivityIndicator/>:
        <FlatList
        data={posts}
        renderItem={({item}) => (
          <PostCard
            item={item}
            onUserPress={() => navigation.navigate('profileScreen', {userId: item.userId, listp:posts, onGoback: (items) => setPosts(items)})}
            onCommentPress={() => navigation.navigate('commentScreen', {
              postId: item.postId,
              comments: item.comments,
              Foodname: item.postFoodName,
              postOwner: item.userId,
              onCommentChanged: handleCommentChanged
            })}
            onImagePress={()=>{navigation.navigate('detailScreen',{postId: item.postId})}}
            editright={false}
          />
        )}
        keyExtractor={(item) => item.postId}
        // ListHeaderComponent={ListHeader}
        // ListFooterComponent={ListHeader}
        showsVerticalScrollIndicator={false}   
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }          
      />  
        }
        
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    flexDirection:'column'
  },
  UserImage:{
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    zIndex: 1,
  },
  addPostTextContainer:{
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#666',
    marginLeft: 10,
    padding: 6,
  },
  ButtonPost:{
    marginVertical:535,
    alignSelf:'flex-end',
    width:50,
    height:40
  },
  ButtonSearch:{
    color: 'black', 
    fontSize: 25, 
    padding: 5
  },
  smallcircle:{
    position:'absolute', 
    color:'#3300FF', 
    marginLeft:15, 
    marginVertical:5
  }
})
