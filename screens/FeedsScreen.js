import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,Image, alert} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import PostCard from '../components/PostCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';


export default function FeedsScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts]= useState(null);
  const [loading, setLoading] = useState(true);

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
      if(loading){ setLoading(false) };
    } catch(e){
      console.log(e);
    }
  }
  
  useEffect(()=>{
    fetchPosts();
  },[])
  

  const handleCommentChanged = () => {
    fetchPosts();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.push("searchScreen")}>
            <Icon name={'search'} style={styles.ButtonSearch} />
       </TouchableOpacity>

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
        <FlatList
            data={posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                onUserPress={() => navigation.navigate('profileScreen', {userId: item.userId, listp:posts, onGoback: (items) => setPosts(items)})}
                onCommentPress={() => navigation.navigate('commentScreen', {
                  postId: item.postId,
                  comments: item.comments,
                  onCommentChanged: handleCommentChanged
                })}
                onImagePress={()=>{navigation.navigate('detailScreen',{item})}}
                editright={false}
              />
            )}
            keyExtractor={(item) => item.postId}
            // ListHeaderComponent={ListHeader}
            // ListFooterComponent={ListHeader}
            showsVerticalScrollIndicator={false}             
          />  
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
  }
})
