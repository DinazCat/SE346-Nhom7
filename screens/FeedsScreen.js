import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,TouchableHighlight,Image, alert, TouchableNativeFeedback} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import PostCard from '../components/PostCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
//import { TouchableOpacity } from 'react-native-gesture-handler';


export default function FeedsScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts]= useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const fetchPosts = async()=>{
      try{
        const list = [];
        await firestore()
        .collection('posts')
        .get()
        .then((querySnapshot)=>{
          querySnapshot.forEach(doc =>{
            const {userId,post, postImg, postTime, comments,likes,name,userImg} = doc.data();
            var Time = new Date(postTime._seconds * 1000).toDateString() + ' at ' + new Date(postTime._seconds * 1000).toLocaleTimeString()
            list.push({
              id: doc.id,
              userName: name,
              userImg: userImg,
              postTime: Time,
              postText: post,
              postImg: postImg,
              liked: true,
              likes: likes,
              comments: comments,
            });
          })

        })
        setPosts(list);
        if(loading){ setLoading(false) };
      } catch(e){
        console.log(e);
      }
    }
    fetchPosts();

  },[])
  return (
    <View style={styles.container}>
      <FormButton title='Logout' onPress={() => logout()}></FormButton>
      <TouchableOpacity onpress={()=> logout()}>
        <Image style={styles.UserImage} source={{uri: user.photoURL}}/>
      </TouchableOpacity>
      <View style={{flex:1}}>
      <FlatList
            data={posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                //onDelete={handleDelete}
                //onPress={() =>
                //  navigation.navigate('HomeProfile', {userId: item.userId})
                //}
              />
            )}
            keyExtractor={(item) => item.id}
            // ListHeaderComponent={ListHeader}
            // ListFooterComponent={ListHeader}
            showsVerticalScrollIndicator={false}             
          />

          {/* <TouchableOpacity
          style={styles.ButtonPost} 
          onpress={()=> navigation.navigate('addPostScreen')}>
          <Icon name={"plus-circle"} style={{color:'green', fontSize: 40}} />
          </TouchableOpacity> */}
          <FormButton  title='Add post' onPress={()=>navigation
          .navigate('addPostScreen')}></FormButton>
          {/* <Button title='Add Post' style={styles.ButtonPost} onPress={()=>navigation
          .navigate('addPostScreen')}/> */}

         
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
  },
  ButtonPost:{
    position:'absolute',
    marginVertical:535,
    alignSelf:'flex-end',
    width:50,
    height:40
  }
})
