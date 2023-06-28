import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TextInput} from 'react-native-gesture-handler';
import {AuthContext} from '../navigation/AuthProvider';
import AvatarComponent from '../components/AvatarComponent';
import PostCard from '../components/PostCard';
import firestore from '@react-native-firebase/firestore';
import LanguageContext from '../context/LanguageContext';
import ThemeContext from '../context/ThemeContext';
import auth from '@react-native-firebase/auth';

const SearchScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [friend, setFriend] = useState([]);
  const [AppUser, setUserApp] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [checkSearch, setCheckSearch] = useState(false);
  const [Content, setContent] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [posts, setPosts] = useState(null);
  const [postfilter, setPostFilter] = useState(null);
  const [peoplefilter, setPeopleFilter] = useState(null);
  const language = useContext(LanguageContext);
  const theme = useContext(ThemeContext);
  const getFollowStatus = followers => {
    if (followers == null) return false;
    let status = false;
    if (Array.isArray(followers)) {
      for (let i = 0; i < followers.length; i++) {
        if (followers[i] === auth().currentUser.uid) {
          status = true;
          break;
        }
      }
    }
    return status;
  };
  const getProfile = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setProfileData(documentSnapshot.data());
          setFollowers(documentSnapshot.data().followers);
          setFollowing(documentSnapshot.data().following);
        }
      });
  };
  const getUser = async () => {
    const list = [];
    await firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          list.push(doc.data());
        });
      });
    setUserApp(list);
  };
  const FriendUknow = () => {
    for (let i = 0; i < followers.length; i++) {
      if (friend.includes(followers[i]) == false) {
        friend.push(followers[i]);
      }
    }
    for (let i = 0; i < following.length; i++) {
      if (friend.includes(following[i]) == false) {
        friend.push(following[i]);
      }
    }
    return friend;
  };
  const fetchPosts = async () => {
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
              liked: true,
              likes: likes,
              comments: comments,
              liked: false,
            });
          });
        });
      setPosts(list);
    } catch (e) {
      console.log(e);
    }
  };
  const filterPost = text => {
    if (text != '') {
      const newData = posts.filter(item => {
        const itemData = (item.postFoodName + '').toUpperCase();
        const textData = text.toUpperCase();
        if (itemData.indexOf(textData) > -1) {
          return item;
        } else {
          return null;
        }
      });
      setPostFilter(newData);
      //  console.log(newData);
      setContent(text);
      setCheckSearch(true);
    } else {
      setCheckSearch(false);
    }
  };
  const filterPeople = text => {
    //setPeopleFilter([])
    if (text != '') {
      //console.log(AppUser[0]);
      const newData = AppUser.filter(item => {
        if (item.name != null) {
          const itemData = item.name.toUpperCase();
          const textData = text.toUpperCase();
          if (itemData.indexOf(textData) > -1) {
            return item;
          } else {
            return null;
          }
        }
      });
      // console.log("1")
      // setTimeout(() => {
      //   setPeopleFilter(newData);
      // },1000);
      setPeopleFilter(newData);
      setContent(text);
      setCheckSearch(true);
      return newData;
      // console.log(newData
      // console.log(peoplefilter);
    } else {
      setCheckSearch(false);
    }
  };
  useEffect(() => {
    getProfile();
    FriendUknow();
    fetchPosts();
    getUser();
  }, []);
  const handleCommentChanged = () => {
    fetchPosts();
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme === 'light' ? '#fff' : '#000'},
      ]}>
      <View style={styles.part1}>
        <TextInput
          style={[
            styles.textinput,
            {color: theme === 'light' ? '#000' : '#fff'},
          ]}
          placeholder={
            language === 'vn'
              ? 'Tìm bài viết, bạn bè...'
              : 'Search posts, friends...'
          }
          placeholderTextColor={theme === 'light' ? '#BABABA' : '#A3A3A3'}
          onChangeText={text => {
            filterPost(text), filterPeople(text);
          }}
        />
        <TouchableOpacity style={{marginTop: 30, marginLeft: 10}}>
          <Icon name={'search'} style={styles.ButtonSearch} />
        </TouchableOpacity>
      </View>
      {checkSearch == false ? (
        <>
          <Text
            style={{
              marginTop: 50,
              marginLeft: 15,
              color: theme === 'light' ? '#000' : '#fff',
            }}>
            {language === 'vn'
              ? 'Những người bạn có thể biết'
              : 'People you may know'}
          </Text>
          <ScrollView>
            {FriendUknow().map((item, index) => (
              <AvatarComponent
                key={index}
                item={item}
                onUserPress={() =>
                  navigation.push('profileScreen', {userId: item})
                }
              />
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={{flexDirection: 'column'}}>
          <View style={styles.Wrapper}>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab(0);
              }}>
              <View
                style={[
                  styles.Item,
                  {backgroundColor: selectedTab == 0 ? '#B1ED97' : '#fff'},
                ]}>
                <Text style={[styles.Title, {color: '#000'}]}>
                  {language === 'vn'
                  ? 'Bài viết'
                  : 'Posts'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedTab(1);
              }}>
              <View
                style={[
                  styles.Item,
                  {backgroundColor: selectedTab == 1 ? '#B1ED97' : '#fff'},
                ]}>
                <Text style={[styles.Title, {color: '#000'}]}>
                  {language === 'vn'
                  ? 'Người dùng'
                  : 'Users'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              width: '90%',
              backgroundColor: 'black',
              alignSelf: 'center',
              marginBottom: 15,
            }}
          />
          {selectedTab == 0 ? (
            <ScrollView>
              {postfilter.map((item, index) => (
                <PostCard
                  key={index}
                  item={item}
                  onImagePress={() => {
                    navigation.navigate('detailScreen', {postId: item.postId});
                  }}
                  onUserPress={() =>
                    navigation.navigate('profileScreen', {
                      userId: item.userId,
                      listp: [],
                      onGoback: () => {},
                    })
                  }
                  onCommentPress={() =>
                    navigation.navigate('commentScreen', {
                      postId: item.postId,
                      Foodname: item.postFoodName,
                      postOwner: item.userId,
                      onCommentChanged: handleCommentChanged,
                    })
                  }
                />
              ))}
            </ScrollView>
          ) : (
            <ScrollView>
              {peoplefilter.map((item, index) => {
                //console.log(item.name)
                return (
                  // <AvatarComponent
                  //   key={index}
                  //   item={item.id}
                  //   onUserPress={() =>
                  //     navigation.push('profileScreen', {userId: item.id})
                  //   }
                  // />
                  <TouchableOpacity
                    style={{marginTop: 10}}
                    key={index}
                    onPress={() => {
                      navigation.push('profileScreen', {userId: item.id});
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 50,
                        width: '90%',
                        borderRadius: 50,
                        backgroundColor: '#98FB98',
                        alignSelf: 'center',
                      }}>
                      <Image
                        style={styles.UserImage}
                        source={{
                          uri: item.userImg
                            ? item.userImg
                            : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
                        }}
                      />
                      <Text
                        style={[
                          styles.UsernameText,
                          {color: theme === 'light' ? '#000' : '#fff'},
                        ]}>
                        {item.name ? item.name : ''}
                      </Text>
                      <Text style={styles.followText}>
                        {getFollowStatus(item ? item.followers : null)
                          ? 'Followed'
                          : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
    backgroundColor: '#D1EEEE',
  },
  part1: {
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 32,
  },
  textinput: {
    width: 330,
    height: 50,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 10,
    marginTop: 20,
    fontSize: 16
  },
  ButtonSearch: {
    color: 'gray',
    fontSize: 30,
    padding: 2,
  },
  Wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  Item: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5
  },
  Title: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
  },
  UserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  UsernameText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
    width: '60%',
  },
  followButton: {
    marginRight: 10,
    backgroundColor: '#66cc00',
    height: 35,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  followText: {
    color: '#9ACD32',
  },
});

export default SearchScreen;
