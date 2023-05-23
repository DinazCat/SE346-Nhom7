import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,Image, ActivityIndicator, RefreshControl} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';
import PostCard from '../components/PostCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Linking } from 'react-native';


export default function FeedsScreen({navigation}) {
  const {user} = useContext(AuthContext);
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

  const getUnsortedPosts = async () => {
    try{
      const list = [];
      await firestore()
      .collection('posts')
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
            likes: likes,
            comments: comments,
            liked: false
          });
        })
      })
      return list;
    } catch(e){
      console.log(e);
      return [];
    }
  };

  const filterPosts = async(type) => {
    
    if(type == 1){
      fetchPosts();
    }
    else if(type == 2){
      const posts = await getUnsortedPosts();
      const likesCountArray = posts.map((post) => ({
        postId: post.postId,
        likesCount: post.likes.length,
      }));
      
      // Sắp xếp mảng tạm thời theo số lượng likes giảm dần
      likesCountArray.sort((a, b) => b.likesCount - a.likesCount);
      const sortedPosts = likesCountArray.map((item) => posts.find((post) => post.postId === item.postId));
      setPosts(sortedPosts);
    }
    else if(type == 3){
      const posts = await getUnsortedPosts();
      const likedPosts = posts.filter(post => post.likes.includes(user.uid));
      setPosts(likedPosts);
    }
    else if(type == 4){
      const posts = await getUnsortedPosts();    
      const filteredPosts = posts.filter(post => {
        const comments = post.comments || [];
        return comments.some(comment => comment.userId === user.uid);
      });
      setPosts(filteredPosts);
    }
    else if(type == 5){
      const posts = await getUnsortedPosts();
      const getFollowing = async () => {
        const documentSnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();     
        if (documentSnapshot.exists) {
          return documentSnapshot.data().following;
        } else {
          return [];
        }
      };
      const following = await getFollowing();
      const filteredPosts = posts.filter(post => following.includes(post.userId));
      setPosts(filteredPosts);
    }
    setrefreshing(false);
  }

  renderContent = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelSubtitle}>Sort by</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(1)}}>
        <Text style={styles.panelButtonTitle}>Newest</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => { sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(2)}}>
        <Text style={styles.panelButtonTitle}>Hottest</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(3)}}>
        <Text style={styles.panelButtonTitle}>Liked</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(4)}}>
        <Text style={styles.panelButtonTitle}>Commented</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(5)}}>
        <Text style={styles.panelButtonTitle}>Following</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => sheetRef.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const sheetRef = React.createRef();
  const fall = new Animated.Value(1);
  return (
    <View style={styles.container}>
       <BottomSheet
        ref={sheetRef}
        snapPoints={[450, 0]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}>
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}/>
        <TouchableOpacity onPress={() => navigation.push("searchScreen")}>
              <Ionicons name={'search-outline'} style={styles.ButtonSearch} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {sheetRef.current.snapTo(0)}}>
              <Ionicons name={'filter-outline'} style={styles.ButtonSearch} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.push("nofiScreen"), setmark(false)}}>
          <View>
              <Ionicons name={'notifications-outline'} style={styles.ButtonSearch} />
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
        showsVerticalScrollIndicator={false}   
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }          
      />  
        }       
      </Animated.View>
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
  },
    panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '100%',
    marginLeft: 10
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
    marginLeft: 20
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    color: '#333'
  },
  panelSubtitle: {
    fontSize: 17,
    color: '#555',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 7,
    borderRadius: 10,
    backgroundColor: '#66cc00',
    alignItems: 'center',
    marginVertical: 5,
  },
  panelButtonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
})
