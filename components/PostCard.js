import { StyleSheet, Text, View, Image, TouchableOpacity, useContext } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const PostCard = ({item, onUserPress, onCommentPress,onImagePress}) => {

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
      function bocuc(){
        if(item.postImg.length== 1)
        {
          return(
            <View>
            <TouchableOpacity onPress={onImagePress}>
            <Image source={{uri:item.postImg[0]}} style={styles.PostImage1} resizeMode='cover'/>
            </TouchableOpacity>
            </View>
    
          )
        }
        else if(item.postImg.length == 2)
        {
          return(
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={onImagePress}>
            <Image source={{uri:item.postImg[0]}} style={styles.PostImage2} resizeMode='cover'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={onImagePress}>
            <Image source={{uri:item.postImg[1]}} style={[styles.PostImage2, {marginLeft:3}]} resizeMode='cover'/>
            </TouchableOpacity>
            </View>
          )
        }
        else if(item.postImg.length== 3)
        {
          return(
            <View style={{flexDirection:'column'}}>
            <TouchableOpacity onPress={onImagePress}>
            <Image source={{uri:item.postImg[0]}} style={styles.PostImage1} resizeMode='cover'/>
            </TouchableOpacity>
           
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={onImagePress}>
            <Image source={{uri:item.postImg[1]}} style={styles.PostImage3}  resizeMode='cover'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={onImagePress}>
            <Image source={{uri:item.postImg[2]}} style={[styles.PostImage2, {marginLeft:3}]} resizeMode='cover'/>
            </TouchableOpacity>
            </View>
            </View>
          )
        }
        else if(item.postImg.length == 4)
        {
          return(
            <View style={{flexDirection:'column'}}>
              <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={onImagePress}>
              <Image source={{uri:item.postImg[0]}} style={styles.PostImage3}  resizeMode='cover'/>
              </TouchableOpacity>
              <TouchableOpacity onPress={onImagePress}>
              <Image source={{uri:item.postImg[1]}} style={[styles.PostImage2, {marginLeft:3}]} resizeMode='cover'/>
              </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={onImagePress}>
              <Image source={{uri:item.postImg[2]}} style={styles.PostImage3} resizeMode='cover'/>
              </TouchableOpacity>
              <TouchableOpacity onPress={onImagePress}>
              <Image source={{uri:item.postImg[3]}} style={[styles.PostImage2, {marginLeft:3}]} resizeMode='cover'/>
              </TouchableOpacity>
              </View>
            </View>
          )
        }
        else if(item.postImg.length > 4)
        {
          return(
            <View style={{flexDirection:'column'}}>
              <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={onImagePress}>
              <Image source={{uri:item.postImg[0]}} style={styles.PostImage3} resizeMode='cover'/>
              </TouchableOpacity>
              <TouchableOpacity onPress={onImagePress}>
              <Image source={{uri:item.postImg[1]}} style={[styles.PostImage2, {marginLeft:3}]} resizeMode='cover'/>
              </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={onImagePress}>
              <Image source={{uri:item.postImg[2]}} style={styles.PostImage3} resizeMode='cover'/>
              </TouchableOpacity>
              <TouchableOpacity onPress={onImagePress}>
              <View style={{ justifyContent:'center'}}>
              <Image source={{uri:item.postImg[3]}} style={[styles.PostImage2, {marginLeft:3, opacity:.4}]} resizeMode='cover'/>
              <Text style={styles.CountText}>+{item.postImg.length-3}</Text>
              </View>
              </TouchableOpacity>
              </View>
            </View>
          )
        }
        else return null
      }
 
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
                <Text style={styles.PostTime}>{item.postTime}</Text>
            </View>
        </View>

        <Text style={styles.PostText}>{item.postText}</Text>

        {/* <Image style={[styles.PostImgsContainer, {height: item.postImg[0] ? 250 : 0}]} 
            source={{uri:item.postImg[0]}} />    */}
            {bocuc()}

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
        width: 40,
        height: 40,
        borderRadius: 20,
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
    CountText:{
        position:'absolute',
        fontWeight:600, 
        alignSelf:'center', 
        color:'#FFCC00', 
        fontSize:30
    },
    PostImgsContainer:{
        width: '100%', 
    
    },
    PostImage1:{
        height:200,
        width:400,
        marginTop:5,
    },
    PostImage2:{
        height:200,
        width:198, 
        marginTop:5
    },
    PostImage3:{
        height:200, 
        width:198, 
        marginTop:5
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