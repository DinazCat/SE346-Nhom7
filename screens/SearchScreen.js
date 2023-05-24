import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import React, { useContext, useEffect,useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from "react-native-gesture-handler";
import { AuthContext } from '../navigation/AuthProvider';
import AvatarComponent from '../components/AvatarComponent';
import PostCard from '../components/PostCard';
import firestore from '@react-native-firebase/firestore';
const SearchScreen = ({navigation}) => {
    const {user} = useContext(AuthContext);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [friend,setFriend] = useState([]);
    const [AppUser,setUserApp] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [checkSearch, setCheckSearch] = useState(false);
    const [Content, setContent] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [posts, setPosts]= useState(null);
    const [postfilter, setPostFilter] = useState(null);
    const [peoplefilter, setPeopleFilter] = useState(null);
    const getProfile = async() => {
        await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            setProfileData(documentSnapshot.data());
            setFollowers(documentSnapshot.data().followers);
            setFollowing(documentSnapshot.data().following);
          }
        })
      }
      const getUser = async() => {
        const list = [];
        await firestore()
        .collection('users')
        .get()
        .then((querySnapshot)=>{
            querySnapshot.forEach(doc =>{list.push(doc.data())})
        })
        setUserApp(list);
      }
      const FriendUknow = ()=>{
        for(let i = 0; i < followers.length; i++)
        {
            if(friend.includes(followers[i]) == false)
            {
                friend.push(followers[i])
            }
        }
        for(let i = 0; i < following.length; i++)
        {
            if(friend.includes(following[i]) == false)
            {
                friend.push(following[i])
            }
        }
        return friend;
      }
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
        } catch(e){
          console.log(e);
        }
      }
      const filterPost = (text) => {
        if(text != ""){
            const newData = posts.filter((item)=>{
                const itemData = (item.postFoodName+"").toUpperCase();
                const textData = text.toUpperCase();
                if (itemData.indexOf(textData)>-1){return item;}
                else {return null;}
            });
            setPostFilter(newData);
            //console.log(newData);
            setContent(text);
            setCheckSearch(true);
        }
        else{
            setCheckSearch(false);
        }

      }
      const filterPeople = (text) =>{
        if(text != ""){
            console.log(AppUser[0]);
            const newData = AppUser.filter((item)=>{
              if(item.name != null){
                const itemData = (item.name).toUpperCase();
                const textData = text.toUpperCase();
                if (itemData.indexOf(textData)>-1){console.log("1");return item;}
               // else {return null;}
              }
            });
            setPeopleFilter(newData);
            setContent(text);
            setCheckSearch(true);
        }
        else {
            setCheckSearch(false);
        }
      }
      useEffect(() => {
        getProfile();
        FriendUknow();
        fetchPosts();
        getUser()
      }, []);
    
  return (
    <View style={styles.container}>
      <View style={styles.part1}>
        <TextInput
          style={styles.textinput}
          placeholder="Tìm bài viết, bạn bè..."
          placeholderTextColor={'rgba(0,0,0,0.8)'}
          onChangeText={text => {filterPost(text), filterPeople(text)}}
        />
        <TouchableOpacity
          style={{marginTop: 27}}
          >
          <Icon name={'search'} style={styles.ButtonSearch} />
        </TouchableOpacity>
      </View>
      {checkSearch == false ? (
        <>
          <Text style={{marginTop: 50, marginLeft: 15}}>
            Những người bạn có thể biết
          </Text>
          <ScrollView>
            {FriendUknow().map((item, index) => (
              <AvatarComponent
                key={index}
                item={item}
                onFollowsChange={(followers, following) =>
                  setProfileData({
                    ...profileData,
                    followers: followers,
                    following: following,
                  })
                }
                onUserPress={() =>
                  navigation.push('profileScreen', {userId: item})
                }
              />
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={{flexDirection:"column"}}>
          <View style={styles.Wrapper}>
            <TouchableOpacity  onPress={() => {setSelectedTab(0)}}>
              <View style={[styles.Item ,{backgroundColor: selectedTab == 0 ? '#f545' : '#fff'}]}>
                <Text style={styles.Title}>Bài viết</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => {setSelectedTab(1)}}>
              <View style={[styles.Item,  {backgroundColor: selectedTab == 1 ? '#f545' : '#fff'}]}>
                <Text style={styles.Title}>Mọi người</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{height:1, width:'90%', backgroundColor: 'black', alignSelf:"center", marginBottom:15}}/>
          {selectedTab == 0 ? (
          <ScrollView>
            {postfilter.map((item, index) => (
            <PostCard key={item.id} item={item} />
            ))}
          </ScrollView>      
        ) : (
            <ScrollView>
            {peoplefilter.map((item, index) => (
              <AvatarComponent
                key={index}
                item={item.id}
                onFollowsChange={(followers, following) =>
                  setProfileData({
                    ...item,
                    followers:followers,
                    following:following,
                  })
                }
                onUserPress={() =>
                  navigation.push('profileScreen', {userId: item.id})
                }
              />
            ))}
          </ScrollView>      
        )}    
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  part1: {
    flexDirection:'row',
  },
  text: {
    fontWeight: "bold",
    fontSize: 32,
  },
  textinput:{
    width:330, 
    height:60, 
    borderRadius:20, 
    borderColor:"black", 
    borderWidth:1,
    marginLeft:10,
    marginTop:20,
  },
  ButtonSearch:{
    color: 'gray', 
    fontSize: 30, 
    padding: 2
  },
  Wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop:30
  },
  Item: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  Title: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchScreen;
