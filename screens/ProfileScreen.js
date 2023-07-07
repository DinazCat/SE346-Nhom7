import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import PostCard from '../components/PostCard';
import AvatarComponent from '../components/AvatarComponent';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import SendNoti from '../components/SendNoti';
import LanguageContext from '../context/LanguageContext';
import ThemeContext from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
const ProfileScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const {userId} = route.params;
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  
  const fetchPosts = async () => {
    try {
      const list = [];
      await firestore()
        .collection('posts')
        .where('userId', '==', userId)
        .orderBy('postTime', 'desc')
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
              total: total,
              Calories: Calories,
              Prep: Prep,
              Cooking: Cooking,
              hashtags: hashtags,
              postFoodSummary: postFoodSummary,
              postImg: postImg,
              likes: likes,
              comments: comments,
            });
          });
        });
      setPosts(list);
      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getProfile = async () => {
    firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfileData(documentSnapshot.data());
          setFollowers(documentSnapshot.data().followers);
          setFollowing(documentSnapshot.data().following);
          console.log(followers);
        }
      });
  };

  const getFollowStatus = followers => {
    if (followers == null) return false;
    let status = false;
    if (Array.isArray(followers)) {
      for (let i = 0; i < followers.length; i++) {
        if (followers[i] === user.uid) {
          status = true;
          break;
        }
      }
    }
    return status;
  };
  const ReloadPosts = async () => {
    try {
      const list = [];
      await firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
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
              postImg: postImg,
              likes: likes,
              comments: comments,
              liked: false,
            });
          });
        });
      route.params.onGoback(list);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getProfile();
    fetchPosts();
    // ReloadPosts();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading, route.params?.userId]);

  const onFollow = async item => {
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
      if (!flag) {
        tempFollowers.push(user.uid);
        //add notification
        firestore()
          .collection('Notification')
          .add({
            PostownerId: userId,
            guestId: auth().currentUser.uid,
            guestName: auth().currentUser.displayName,
            guestImg: auth().currentUser.photoURL,
            classify: 'Follow',
            time: firestore.Timestamp.fromDate(new Date()),
            text: auth().currentUser.displayName + ' are following you.',
            postid: '',
            Read: 'no',
          });
        firestore()
          .collection('NotificationSetting')
          .doc(userId)
          .get()
          .then(doc => {
            if (doc.exists) {
              const data = doc.data();
              try {
                const gt = data.follow;
                if (gt === true) {
                  SendNoti(
                    auth().currentUser.displayName + ' are following you.',
                    userId,
                  );
                }
              } catch {}
            }
          });
      }
    } else {
      tempFollowers.push(user.uid);
      firestore()
        .collection('Notification')
        .add({
          PostownerId: userId,
          guestId: auth().currentUser.uid,
          guestName: auth().currentUser.displayName,
          guestImg: auth().currentUser.photoURL,
          classify: 'Follow',
          time: firestore.Timestamp.fromDate(new Date()),
          text: auth().currentUser.displayName + ' are following you.',
          postid: '',
          Read: 'no',
        });
      firestore()
        .collection('NotificationSetting')
        .doc(userId)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            try {
              const gt = data.follow;
              if (gt === true) {
                SendNoti(
                  auth().currentUser.displayName + ' are following you.',
                  userId,
                );
              }
            } catch {}
          }
        });
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
      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      following = snapshot.data().following ? snapshot.data().following : [];
      if (following.length > 0) {
        let flag = false;
        for (let i = 0; i < following.length; i++) {
          if (following[i] === userId) {
            following.splice(i, 1);
            flag = true;
            break;
          }
        }
        if (!flag) {
          following.push(userId);
        }
      } else {
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
  };
  deleteP = id => {
    firestore()
      .collection('posts')
      .doc(id)
      .delete()
      .then(() => {
        Alert.alert('Post deleted', 'This post has been permanently deleted');
      })
      .catch(e => console.log('error when delete: ' + e));
  };
  deletepost = id => {
    const filteredData = posts.filter(item => item.postId !== id);
    setPosts(filteredData);
    firestore()
      .collection('posts')
      .doc(id)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();
          if (postImg != null) {
            if (postImg.length == 0) deleteP(id);
            else
              for (let i = 0; i < postImg.length; i++) {
                const storageRef = storage().refFromURL(postImg[i]);
                const imageRef = storage().ref(storageRef.fullPath);
                imageRef
                  .delete()
                  .then(() => {
                    if (i == postImg.length - 1) deleteP(id);
                  })
                  .catch(e => {
                    console.log('error when delete image ' + e);
                  });
              }
          }
        }
      });
  };
  const handleCommentChanged = () => {
    fetchPosts();
  };

  const PopupMenu = () =>{
    const[visible,setvisible] = useState(false);
    const options = [
      {
        title:language === 'vn' ?'Đã lưu':"Saved",
        action:()=>{
          navigation.push('savedScreen')
        },

      },
    ];

    return(
      <View style={{flexDirection:'row'}}>
       {visible&& <View style = {styles.popup}>
            {
              options.map((op,i)=>(
                <TouchableOpacity  style={[styles.popupitem,{borderBottomWidth:i===options.length-1?0:1}]} key={i} onPress={op.action}>
                  <Text>{op.title}</Text>
                </TouchableOpacity>
              ))
            }
          </View>}
       <TouchableOpacity style={styles.MenuButton} onPress={()=>setvisible(!visible)}>
            <Icon name={'bars'} style={{fontSize:20}}  color={theme === 'light'? '#000' : '#fff'}/>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View
      style={{backgroundColor: theme === 'light' ? '#fff' : '#000', flex: 1}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
          <View style={{flexDirection:'row',}}>
            <View style={{flex:1}}/>
          {(auth().currentUser.uid ===  userId ) && <PopupMenu/>}
          </View>
        <Image
          style={styles.userImg}
          source={{
            uri: profileData
              ? profileData.userImg
                ? profileData.userImg
                : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
              : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
          }}
        />
        <Text
          style={[
            styles.userName,
            {color: theme === 'light' ? '#000' : '#fff'},
          ]}>
          {profileData ? profileData.name : ''}
        </Text>
        <Text multiline style={styles.aboutUser}>
          {profileData
            ? profileData.about ||
              (language === 'vn'
                ? 'Không có thông tin khác.'
                : 'No details added.')
            : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          {userId != user.uid ? (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => onFollow(profileData)}>
                <Text style={styles.userBtnTxt}>
                  {getFollowStatus(profileData ? profileData.followers : null)
                    ? language === 'vn'
                      ? 'Bỏ theo dõi'
                      : 'Unfollow'
                    : language === 'vn'
                    ? 'Theo dõi'
                    : 'Follow'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate('editProfileScreen');
                }}>
                <Text style={styles.userBtnTxt}>
                  {language === 'vn' ? 'Chỉnh sửa hồ sơ' : 'Edit Profile'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab(0);
            }}>
            <View
              style={[
                styles.userInfoItem,
                {
                  backgroundColor:
                    selectedTab == 0
                      ? '#D3FBB8'
                      : theme === 'light'
                      ? '#fff'
                      : '#000',
                },
              ]}>
              <Text style={styles.userInfoTitle}>{posts.length}</Text>
              <Text style={styles.userInfoSubTitle}>
                {language === 'vn' ? 'Bài viết' : 'Posts'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab(1);
            }}>
            <View
              style={[
                styles.userInfoItem,
                {
                  backgroundColor:
                    selectedTab == 1
                      ? '#FAF7A8'
                      : theme === 'light'
                      ? '#fff'
                      : '#000',
                },
              ]}>
              <Text style={styles.userInfoTitle}>
                {profileData ? profileData.followers.length : 0}
              </Text>
              <Text style={styles.userInfoSubTitle}>
                {language === 'vn' ? 'Người theo dõi' : 'Followers'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab(2);
            }}>
            <View
              style={[
                styles.userInfoItem,
                {
                  backgroundColor:
                    selectedTab == 2
                      ? '#A7C9FF'
                      : theme === 'light'
                      ? '#fff'
                      : '#000',
                },
              ]}>
              <Text style={styles.userInfoTitle}>
                {profileData ? profileData.following.length : 0}
              </Text>
              <Text style={styles.userInfoSubTitle}>
                {language === 'vn' ? 'Đang theo dõi' : 'Following'}
              </Text>
            </View>
          </TouchableOpacity>
        
        </View>
        {selectedTab == 0 && (
          <>
            {posts.map((item, key) => (
              <PostCard
                key={key}
                item={item}
                editPost={() => navigation.push('editPostScreen', {item})}
                deletePost={() => deletepost(item.postId)}
                onUserPress={() => {
                  navigation.navigate('profileScreen', {userId: item.userId});
                }}
                onCommentPress={() =>
                  navigation.navigate('commentScreen', {
                    postId: item.postId,
                    Foodname: item.postFoodName,
                    postOwner: item.userId,
                    onCommentChanged: handleCommentChanged,
                  })
                }
                onImagePress={() => {
                  navigation.navigate('detailScreen', {postId: item.postId});
                }}
                editright={true}
              />
            ))}
          </>
        )}
        {selectedTab == 1 && (
          <>
            {followers.map((item, index) => (
              <AvatarComponent
                key={index}
                item={item}
                //onFollowsChange={(followers, following) => setProfileData({ ...profileData, followers: followers, following: following })}
                onUserPress={() =>
                  navigation.push('profileScreen', {userId: item})
                }
              />
            ))}
          </>
        )}
        {selectedTab == 2 && (
          <>
            {following.map((item, index) => (
              <AvatarComponent
                key={index}
                item={item}
                //onFollowsChange={(followers, following) => setProfileData({ ...profileData, followers: followers, following: following })}
                onUserPress={() =>
                  navigation.push('profileScreen', {userId: item})
                }
              />
            ))}
          </>
        )}

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 60,
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
  calories: {
    fontSize: 14,
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
    width: '50%',
    borderColor: '#66cc00',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  userBtnTxt: {
    color: '#66cc00',
    fontSize: 16,
    fontWeight: '500',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
    width: 110,
    borderRadius: 5,
    paddingVertical: 2,
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
  MenuButton:{
    color: 'black', 
    fontSize: 40, 
    padding: 10,
    alignSelf:"center",
  },
  popup:{
    borderRadius:8,
    borderColor:'#333',
    borderWidth:1,
    backgroundColor:'#fff',
    width:62,
    height:35,
    textAlign:'center',
  },
  popupitem:
  {
    borderBottomColor:'black', 
    alignItems:'center', 
    width:60, 
    alignSelf:'center',
    paddingVertical:5
  }
});
