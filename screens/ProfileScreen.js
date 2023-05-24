import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect,useState } from 'react'
import { AuthContext } from '../navigation/AuthProvider'
import firestore from '@react-native-firebase/firestore';
import PostCard from '../components/PostCard';
import AvatarComponent from '../components/AvatarComponent';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import SendNoti from '../components/SendNoti';
const ProfileScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const {userId} = route.params;
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const fetchPosts = async()=>{
    try{
      const list = [];
      await firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .orderBy('postTime', 'desc')
      .get()
      .then((querySnapshot)=>{
        querySnapshot.forEach(doc =>{
        //   const {userId,post, postImg, postTime, comments,likes,name,userImg,} = doc.data();
        //   var Time = new Date(postTime._seconds * 1000).toDateString() + ' at ' + new Date(postTime._seconds * 1000).toLocaleTimeString()
        //   list.push({          
        //     id: doc.id,
        //     userId: userId,
        //     userName: name,
        //     userImg: userImg,
        //     postTime: Time,
        //     postText: post,
        //     postImg: postImg,
        //     likes: likes,
        //     comments: comments,
        //   });
        // })
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

  const getProfile = async() => {
    await firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        setProfileData(documentSnapshot.data());
        setFollowers(documentSnapshot.data().followers);
        setFollowing(documentSnapshot.data().following);
      }
    })
  }

  const getFollowStatus = followers => {
    if(followers == null) return false;
    let status = false;
    if (Array.isArray(followers)) {
      for (let i = 0; i < followers.length; i++) {
          if (followers[i] === user.uid) {
              status = true;
              break;
          }
      }
  }
    return(status);
  };
  const ReloadPosts = async()=>{
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
      route.params.onGoback(list);
    } catch(e){
      console.log(e);
    }
  }
  
  useEffect(()=>{
    fetchPosts();
  },[])
  useEffect(() => {
    getProfile();
    fetchPosts();
   // ReloadPosts();
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading, route.params?.userId]);

  const onFollow = async (item) => {

    //update followers in userprofile

    let tempFollowers = item.followers ? item.followers : [];
    if (tempFollowers.length > 0) {
        let flag = false;
        for (let i = 0; i < item.followers.length; i++) {                          
            if (item.followers[i] === user.uid) {
                tempFollowers.splice(i, 1); 
                flag = true;
                break;
            }
        } 
        if (!flag) {tempFollowers.push(user.uid);
        //add notification
        firestore().collection('Notification').add({
          PostownerId: userId,
          guestId: auth().currentUser.uid,
          guestName: auth().currentUser.displayName,
          guestImg:auth().currentUser.photoURL,
          classify:'Follow',
          time:firestore.Timestamp.fromDate(new Date()),
          text: auth().currentUser.displayName+' đang theo dõi bạn.',
          postid: '',
          Read:'no',

        });
        SendNoti(auth().currentUser.displayName+' đang theo dõi bạn.',userId);
        }                    
    } 
    else {
      tempFollowers.push(user.uid);
      firestore().collection('Notification').add({
        PostownerId: userId,
        guestId: auth().currentUser.uid,
        guestName: auth().currentUser.displayName,
        guestImg:auth().currentUser.photoURL,
        classify:'Follow',
        time:firestore.Timestamp.fromDate(new Date()),
        text: auth().currentUser.displayName+' đang theo dõi bạn.',
        postid: '',
        Read:'no',

      });
      SendNoti(auth().currentUser.displayName+' đang theo dõi bạn.',userId);
    }

    firestore()
    .collection('users')
    .doc(userId)
    .update({
      followers: tempFollowers,
    })
    .then(() => {
      console.log('user updated followers!');
    })
    .catch(error => {
      console.log(error);
    });

    //update following of current user   

    let following = [];
    try {
      const snapshot = await firestore().collection('users').doc(user.uid).get();
      following = snapshot.data().following ? snapshot.data().following : [];
      if(following.length > 0){
        let flag = false;
        for (let i = 0; i < following.length; i++) {                          
          if (following[i] === userId) {
              following.splice(i, 1); 
              flag = true;
              break;
          }
        } 
        if (!flag) {following.push(userId)}    
      }
      else {
        following.push(userId);
      }
    } catch (error) {
      console.log(error);
    }

    firestore()
    .collection('users')
    .doc(user.uid)
    .update({
      following: following,
    })
    .then(() => {
      console.log('curUser updated following!');
      getProfile();
    })
    .catch(error => {
      console.log(error);
    });
  }
  deleteP = id => {
    firestore()
    .collection('posts')
    .doc(id)
    .delete()
    .then(()=>{Alert.alert('Post deleted')})
    .catch(e=>console.log("error when delete: "+e))
  }
  deletepost = id => {
    const filteredData = posts.filter(item => item.postId !== id);
    setPosts(filteredData);
    const filterlistP = (route.params.listp).filter( item => item.postId !== id);
    route.params.onGoback(filterlistP);
    firestore().collection('posts')
    .doc(id)
    .get()
    .then(documentSnapshot => {
      if(documentSnapshot.exists)
      {
        const {postImg} = documentSnapshot.data();
        if(postImg != null)
        {
          for(let i = 0; i<postImg.length; i++)
          {
            const storageRef = storage().refFromURL(postImg[i]);
            const imageRef = storage().ref(storageRef.fullPath);
            imageRef
            .delete()
            .then(()=>{ if(i == postImg.length-1) deleteP(id)})
            .catch((e)=>{console.log('error when delete image '+e)})
          }
          
        }
      
      }
    })
   
  }
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.userImg}
          source={{uri: profileData ? profileData.userImg ? profileData.userImg : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png' : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'}}
        />
        <Text style={styles.userName}>{profileData ? profileData.name : ''}</Text>
        <Text multiline style={styles.aboutUser}>
        {profileData ? profileData.about || 'No details added.' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          {(userId != user.uid) ? (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => onFollow(profileData)}>
                <Text style={styles.userBtnTxt}>{getFollowStatus(profileData ? profileData.followers : null) ? 'Unfollow' : 'Follow'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate('editProfileScreen');
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <TouchableOpacity onPress={() => {setSelectedTab(0)}}>
            <View style={[styles.userInfoItem, {backgroundColor: selectedTab == 0 ? '#D3FBB8' : '#fff'}]}>
              <Text style={styles.userInfoTitle}>{posts.length}</Text>
              <Text style={styles.userInfoSubTitle}>Posts</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSelectedTab(1)}}>
            <View style={[styles.userInfoItem, {backgroundColor: selectedTab == 1 ? '#FAF7A8' : '#fff'}]}>
              <Text style={styles.userInfoTitle}>{profileData ? profileData.followers.length : 0}</Text>
              <Text style={styles.userInfoSubTitle}>Followers</Text>
            </View>
          </TouchableOpacity>  
          <TouchableOpacity onPress={() => {setSelectedTab(2)}}>
            <View style={[styles.userInfoItem, {backgroundColor: selectedTab == 2 ? '#f545' : '#fff'}]}>
              <Text style={styles.userInfoTitle}>{profileData ? profileData.following.length : 0}</Text>
              <Text style={styles.userInfoSubTitle}>Following</Text>
            </View>
          </TouchableOpacity>                
        </View>
        {selectedTab == 0 ? (
          <>
            {posts.map((item,key) => (
            <PostCard key={key} item={item} 
            editPost={()=>navigation.push('editPostScreen',{item})}
            deletePost={()=>deletepost(item.postId)}
            editright={true}/>
            ))}
          </>      
        ) : selectedTab == 1 ? (
          <>
            {followers.map((item, index) => (
            <AvatarComponent key={index} item={item}
            onFollowsChange={(followers, following) => setProfileData({ ...profileData, followers: followers, following: following })}
            onUserPress={() => navigation.push('profileScreen', {userId: item})}/>
            ))}
          </>      
        ) : (
          <>
            {following.map((item, index) => (
            <AvatarComponent key={index} item={item}
            onFollowsChange={(followers, following) => setProfileData({ ...profileData, followers: followers, following: following })}
            onUserPress={() => navigation.push('profileScreen', {userId: item})}
            />
            ))}
          </>  
        )}       
      </ScrollView>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  userImg: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#66cc00',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#66cc00',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
    width: 100,
    borderRadius: 5,
    paddingVertical: 2
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
})