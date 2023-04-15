import { StyleSheet, Text, View, Image, TouchableOpacity, useContext } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const PostCard = ({item, onUserPress, onCommentPress,}) => {

    const [liked, setLiked] = useState();
    
    useEffect(() => {
        getLikeStatus(item.likes);
        
    })

    const getLikeStatus = (likes) => {
        let status = false;
        if (Array.isArray(likes)) {
            for (let i = 0; i < likes.length; i++) {
                if (likes[i] === auth().currentUser.uid) {
                    status = true;
                    break;
                }
            }
        }
        setLiked(status);
    }; 

    const onLike = (item) => {
        let tempLikes = item.likes;
        if (tempLikes.length > 0) {
            let flag = false;
            for (let i = 0; i < item.likes.length; i++) {                          
                if (item.likes[i] === auth().currentUser.uid) {
                    tempLikes.splice(i, 1); 
                    flag = true;
                    break;
                }
            } 
            if (!flag) {tempLikes.push(auth().currentUser.uid)}                    
        } 
        else {
          tempLikes.push(auth().currentUser.uid);
        }
    
        firestore()
          .collection('posts')
          .doc(item.postId)
          .update({
            likes: tempLikes,
          })
          .then(() => {
            console.log('post updated!');
          })
          .catch(error => {});
        setLiked(!liked);
      };
 
  return (
    <View style={styles.Container}>
        <View style={styles.UserInfoContainer}>
            <TouchableOpacity onPress={onUserPress}>
                <Image style={styles.UserImage} source={{uri: item.userImg}}/>
            </TouchableOpacity>            
            <View style={styles.UserInfoTextContainer}>
                <TouchableOpacity onPress={onUserPress}>
                    <Text style={styles.UsernameText}>{item.userName}</Text>
                </TouchableOpacity>                
                <Text style={styles.PostTime}>{item.postTime.toString()}</Text>
            </View>
        </View>

        <Text style={styles.PostText}>{item.postText}</Text>

        <Image style={[styles.PostImgsContainer, {height: item.postImg ? 250 : 0}]} 
            source={{uri:item.postImg}} />   

        <View style={styles.devider}/>

        <View style={styles.InteractionContainer}>
            <TouchableOpacity onPress={() => onLike(item)}>
                <View style={styles.Interaction}>
                    <Ionicons name={liked ? 'heart' : 'heart-outline'} size={25} color={liked ? '#E61717' : '#333'} />
                    <Text style={[styles.InteractionText, {color: liked ? '#E61717' : '#666'}]}>
                        {item.likes.length === 1 ? '1 Like' :
                        item.likes.length > 1 ? item.likes.length + ' Likes' :
                        'Like'}</Text>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onCommentPress}>
                <View style={styles.Interaction}>
                    <Ionicons name="md-chatbubble-outline" size={25}/>
                    <Text style={styles.InteractionText}>
                        {item.comments.length === 1 ? '1 Comment' :
                        item.comments.length > 1 ? item.comments.length + ' Comments' :
                        'Comment'}</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    Container:{
        backgroundColor: '#f8f8f8',
        width: '100%',
        marginBottom: 10,
        borderRadius: 5,
    },
    UserInfoContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 5,
    },
    UserImage:{
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    UserInfoTextContainer:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 5,
    },
    UsernameText:{
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular',
    },
    PostTime:{
        fontSize: 12,
        fontFamily: 'Lato-Regular',
        color: '#666',
    },
    PostText:{
        fontSize: 14,
        fontFamily: 'Lato-Regular',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    PostImgsContainer:{
        width: '100%', 
    
    },
    PostImage:{

    },
    devider:{
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 1,
        width: '92%',
        alignSelf: 'center',
        marginTop: 15,
    },
    InteractionContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
    },
    Interaction:{
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
    },
    InteractionText:{
        fontSize: 12,
        fontFamily: 'Lato-Regular',
        fontWeight: 'bold',
        marginTop: 5,
        marginLeft: 5,
    }

})