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
import LanguageContext from "../context/LanguageContext";
import ThemeContext from '../context/ThemeContext';


export default function FeedsScreen({navigation}) {
  const {user} = useContext(AuthContext);
  const [posts, setPosts]= useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setrefreshing] = useState(true);
  const [mark, setmark] = useState(false);
  const [userimg, setUserImg] = useState();
  const [hashtag, sethashtag] = useState([]);
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext)

  const fetchPosts = async()=>{
    try{
      firestore()
      .collection('posts')
      .orderBy('postTime', 'desc')
      .onSnapshot((querySnapshot)=>{
        const list = [];
        querySnapshot.forEach(doc =>{
          const {userId,postFoodName, postFoodRating, postFoodMaking, postFoodIngredient, postFoodSummary, postImg, postTime, comments,likes,name,userImg,total, Calories, Prep, Cooking, hashtags} = doc.data();
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
            total:total, Calories:Calories, Prep:Prep, Cooking:Cooking, hashtags:hashtags,
            postImg: postImg,
           // liked: true,
            likes: likes,
            comments: comments,
            liked: false,
          });
        })
        setPosts(list);
        setrefreshing(false);
        if(loading){ setLoading(false) };

      })
     
    } catch(e){
      console.log(e);
    }
  }
  const getMark= async()=>
  {
    firestore()
    .collection('Notification')
    .onSnapshot((querySnapshot)=>{
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
    setUserImg(auth().currentUser.photoURL)
  
  }

  const getUnsortedPosts = async () => {
    //try{
    //  firestore()
    //   .collection('posts')
    //   .onSnapshot((querySnapshot)=>{
    //     const list = [];
    //     querySnapshot.forEach(doc =>{
    //       const {userId,postFoodName, postFoodRating, postFoodMaking, postFoodIngredient, postFoodSummary, postImg, postTime, comments,likes,name,userImg,total, Calories, Prep, Cooking, hashtags} = doc.data();
    //       var Time = new Date(postTime._seconds * 1000).toDateString() + ' at ' + new Date(postTime._seconds * 1000).toLocaleTimeString()
    //       list.push({          
    //         postId: doc.id,
    //         userId: userId,
    //         userName: name,
    //         userImg: userImg,
    //         postTime: Time,
    //         postFoodName: postFoodName,
    //         postFoodRating: postFoodRating,
    //         postFoodIngredient:postFoodIngredient,
    //         postFoodMaking: postFoodMaking,
    //         postFoodSummary: postFoodSummary,
    //         total:total, Calories:Calories, Prep:Prep, Cooking:Cooking, hashtags:hashtags,
    //         postImg: postImg,
    //         likes: likes,
    //         comments: comments,
    //         liked: false
    //       });
    //     })
    //   })
    //   return list;
    // } catch(e){
    //   console.log(e);
    //   return [];
    // }
    return new Promise((resolve, reject) => {
    const unsubscribe = firestore().collection('posts').onSnapshot(
      (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          const {userId,postFoodName, postFoodRating, postFoodMaking, postFoodIngredient, postFoodSummary, postImg, postTime, comments,likes,name,userImg,total, Calories, Prep, Cooking, hashtags} = doc.data();
          var Time = new Date(postTime._seconds * 1000).toDateString() + ' at ' + new Date(postTime._seconds * 1000).toLocaleTimeString();
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
        resolve(list);
      },
      (error) => {
        console.log(error);
        reject([]);
      }
    );

    // Hủy lắng nghe sự thay đổi khi không cần thiết nữa
    return () => unsubscribe();
  });
  };

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
  ]);

  const Hashtags = ({each})=>(
    <TouchableOpacity style={{backgroundColor:(each.tick)?'#9ACD32':'#E6E6FA', marginLeft:15, marginTop:10, alignItems:'center', borderRadius:15, borderColor:'#8470FF', borderWidth:1, padding: 1, paddingHorizontal:7, paddingVertical: 4}}
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
     
    }}>
        <Text style={styles.TextStyle}>{each.key}</Text>
    </TouchableOpacity>
  );

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
    else if(type == 6){
      console.log(hashtag);
      const posts = await getUnsortedPosts();
      const filteredPosts = posts.filter((post) => {
        const postHashtags = post.hashtags;
        return hashtag.every((desiredHashtag) =>
          postHashtags.includes(desiredHashtag)
        );
      });
      setPosts(filteredPosts);
    }
    setrefreshing(false);
  }

  renderContent = () => (
    <View style={[styles.panel, {backgroundColor: theme === 'light'? '#EAEAEA' : '#838383'}]}>
      <View style={{alignItems: 'center'}}>
        <Text style={[styles.panelSubtitle, {color: theme === 'light'? '#000' : '#fff'}]}>{language === 'vn' ? 'Lọc bằng' : 'Filter by'}</Text>
      </View>    
      <View style={{height: 510, borderColor: '#DDD', borderBottomWidth: 1, borderTopWidth: 1}}>
          <ScrollView>
            <Text style={[styles.TextStyle,{marginTop: 15, color: theme === 'light'? '#000' : '#fff'}]}>Post</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(1)}}>
              <Text style={[styles.panelButtonTitle, {color: theme === 'light'? '#000' : '#fff'}]}>Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => { sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(2)}}>
              <Text style={[styles.panelButtonTitle, {color: theme === 'light'? '#000' : '#fff'}]}>Hottest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(3)}}>
              <Text style={[styles.panelButtonTitle, {color: theme === 'light'? '#000' : '#fff'}]}>Liked</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(4)}}>
              <Text style={[styles.panelButtonTitle, {color: theme === 'light'? '#000' : '#fff'}]}>Commented</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(5)}}>
              <Text style={[styles.panelButtonTitle, {color: theme === 'light'? '#000' : '#fff'}]}>Following</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.TextStyle,{marginTop:20, color: theme === 'light'? '#000' : '#fff'}]}>Meal Type</Text>
          <FlatList
            data={mealtype}
            renderItem={({item})=><Hashtags each={item} />}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
          <Text style={[styles.TextStyle,{marginTop:20, color: theme === 'light'? '#000' : '#fff'}]}>Cooking Style</Text>
          <FlatList
            data={cookingstyle}
            renderItem={({item})=><Hashtags each={item} />}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
          <Text style={[styles.TextStyle,{marginTop:20, color: theme === 'light'? '#000' : '#fff'}]}>Course</Text>
          <FlatList
            data={course}
            renderItem={({item})=><Hashtags each={item} />}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
          <Text style={[styles.TextStyle,{marginTop:20, color: theme === 'light'? '#000' : '#fff'}]}>Main Ingredient</Text>
          <FlatList
            data={mainingredient}
            renderItem={({item})=><Hashtags each={item} />}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
          <Text style={[styles.TextStyle,{marginTop:20, color: theme === 'light'? '#000' : '#fff'}]}>Diet Type</Text>
          <FlatList
            data={diettype}
            renderItem={({item})=><Hashtags each={item} />}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
          <View style={{height:20, width:"100%"}}/>
        </ScrollView>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
          <TouchableOpacity
            style={[styles.panelButton, {width: 100}]}
            onPress={() => {sheetRef.current.snapTo(1); setrefreshing(true); filterPosts(6)}}>
            <Text style={[styles.panelButtonTitle, {fontWeight: '700'}]}>Ok</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.panelButton, {width: 100}]}
            onPress={() => {sheetRef.current.snapTo(1)}}>
            <Text style={[styles.panelButtonTitle, {fontWeight: '700'}]}>Cancel</Text>
          </TouchableOpacity>         
        </View>
    </View>

  );

  renderHeader = () => (
    <View style={[styles.header, {backgroundColor: theme === 'light'? '#EAEAEA' : '#838383'}]}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const sheetRef = React.createRef();
  const fall = new Animated.Value(1);

  
  return (
    <View style={{backgroundColor: theme === 'light'? '#FFFFFF' : '#000000', flex: 1}}>
      <BottomSheet
          ref={sheetRef}
          snapPoints={['93%', -100]}
          renderContent={renderContent}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
        />
      <View style={[styles.container, {backgroundColor: theme === 'light'? '#FFFFFF' : '#000000'}]}>      
        <Animated.View
          style={{
            opacity: fall,
          }}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1}}/>
          <TouchableOpacity onPress={() => navigation.push("searchScreen")}>
                <Ionicons name={'search-outline'} style={[styles.ButtonSearch, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {sheetRef.current.snapTo(0)}}>
                <Ionicons name={'filter-outline'} style={[styles.ButtonSearch, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setmark(false),navigation.push("nofiScreen")}}>
            <View>
                <Ionicons name={'notifications-outline'} style={[styles.ButtonSearch, {color: theme === 'light'? '#000000' : '#FFFFFF'}]}/>
              {(mark)&&<FontAwesome name="circle" style={styles.smallcircle}/>}
            </View>        
          </TouchableOpacity>
        </View>
        
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => { console.log(user);
            navigation.navigate('profileScreen', {userId: user.uid})}}>
            <Image style={styles.UserImage} source={{uri: userimg? userimg : user.photoURL? user.photoURL : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.push('addPostScreen')}>
            <View style={styles.addPostTextContainer}>
              <Text style={{color: theme === 'light'? '#000000' : '#FFFFFF'}}>
              {language === 'vn' ? 'Hôm nay bạn ăn gì? Chia sẻ với mọi người...' : 'What did you eat today? Share with everyone...'}
              </Text>
            </View>          
          </TouchableOpacity>
        </View>

          {refreshing ? <ActivityIndicator/>:
          <FlatList
          data={posts}
          renderItem={({item}) => (
            <PostCard
              item={item}
              onUserPress={() => {navigation.navigate('profileScreen', {userId: item.userId})}}
              onCommentPress={() => navigation.navigate('commentScreen', {
                postId: item.postId,
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
    </View>
    
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    flexDirection:'column',
    marginBottom: 130
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
    backgroundColor: '#fff',
    paddingTop: 20,
    width: '100%',
  },
  header: {
    backgroundColor: '#fff',
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
  },
  panelSubtitle: {
    fontSize: 18,
    color: '#555',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#66cc00',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  panelButtonTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#222',
  },
})
