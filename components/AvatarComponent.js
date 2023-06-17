import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, {useState, useEffect, useContext} from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SendNoti from './SendNoti';
import ThemeContext from '../context/ThemeContext';

const AvatarComponent = ({item, onUserPress, onFollowsChange}) => {

  const [avatar, setAvatar] = useState();
  const [onFollowClick, setOnFollowClick] = useState(false);
  const theme = useContext(ThemeContext)
  const getFollowStatus = followers => {
    if(followers == null) return false;
    let status = false;
    if (Array.isArray(followers)) {
      for (let i = 0; i < followers.length; i++) {
          if (followers[i] === auth().currentUser.uid) {
              status = true;
              break;
          }
      }
  }
    return(status);
  };

  const getAvatar = async() => {
    await firestore()
    .collection('users')
    .doc(item)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        setAvatar(documentSnapshot.data());
      }
    })
  }
  
  useEffect(() => {
    getAvatar();
  }, [onFollowClick]);

  const onFollow = async (item) => {

    //update followers in userprofile

    let tempFollowers = item.followers ? item.followers : [];
    if (tempFollowers.length > 0) {
        let flag = false;
        for (let i = 0; i < item.followers.length; i++) {                          
            if (item.followers[i] === auth().currentUser.uid) {
                tempFollowers.splice(i, 1); 
                flag = true;
                break;
            }
        } 
        if (!flag) {
          tempFollowers.push(auth().currentUser.uid)
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
          SendNoti(auth().currentUser.displayName+' đang theo dõi bạn.', userId);
        }                    
    } 
    else {
      tempFollowers.push(auth().currentUser.uid);
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
    .doc(item.id)
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
      const snapshot = await firestore().collection('users').doc(auth().currentUser.uid).get();
      following = snapshot.data().following ? snapshot.data().following : [];
      if(following.length > 0){
        let flag = false;
        for (let i = 0; i < following.length; i++) {                          
          if (following[i] === item.id) {
              following.splice(i, 1); 
              flag = true;
              break;
          }
        } 
        if (!flag) {following.push(item.id)}    
      }
      else {
        following.push(item.id);
      }
    } catch (error) {
      console.log(error);
    }

    firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .update({
      following: following,
    })
    .then(() => {
      console.log('curUser updated following!');
      setOnFollowClick(!onFollowClick);
      getAvatar();
      onFollowsChange(tempFollowers, following);
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onUserPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image style={styles.UserImage} source={{uri: avatar ? avatar.userImg ? avatar.userImg :'https://cdn-icons-png.flaticon.com/512/1946/1946429.png' : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'}}/>
          <Text style={[styles.UsernameText, {color: theme==='light'?'#000':'#fff'}]}>{avatar ? avatar.name : ''}</Text>
        </View>
      </TouchableOpacity>
      {(auth().currentUser.uid !== item) &&
      <TouchableOpacity style={styles.followButton} onPress={() => onFollow(avatar)}>
        <Text style={styles.followText}>{getFollowStatus(avatar ? avatar.followers : null) ? 'Unfollow' : 'Follow'}</Text>
      </TouchableOpacity>
      }
  </View>
  )
}

export default AvatarComponent

const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    UserImage:{
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
    },
    UsernameText:{
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 10
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
        color: '#fff',
    }
})
