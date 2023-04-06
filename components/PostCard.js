import { StyleSheet, Text, View, Image, TouchableOpacity, useContext } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

const PostCard = ({item}) => {

 //   const {user} = useContext(AuthContext);
    likeIcon = item.liked ? 'heart' : 'heart-outline';
    likeIconColor = item.liked ? '#2e64e5' : '#333';
    if (item.comments == 1) {
        commentText = '1 Comment';
      } else if (item.comments > 1) {
        commentText = item.comments + ' Comments';
      } else {
        commentText = 'Comment';
      }
    
    if (item.likes == 1) {
        likeText = '1 Like';
      } else if (item.likes > 1) {
        likeText = item.likes + ' Likes';
      } else {
        likeText = 'Like';
      }
    
  return (
    <View style={styles.Container}>
        <View style={styles.UserInfoContainer}>
            <Image style={styles.UserImage} source={{uri: item.userImg}}/>
            <View style={styles.UserInfoTextContainer}>
                <TouchableOpacity>
                    <Text style={styles.UsernameText}>{item.userName}</Text>
                </TouchableOpacity>                
                <Text style={styles.PostTime}>{item.postTime.toString()}</Text>
            </View>
        </View>

        <Text style={styles.PostText}>{item.postText}</Text>

        <Image style={styles.PostImgsContainer} source={{uri:item.postImg}}/>

        <View style={styles.devider}/>

        <View style={styles.InteractionContainer}>
            <View style={styles.Interaction} active={item.liked}>
                <Ionicons name={likeIcon} size={25} color={likeIconColor} />
                <Text style={styles.InteractionText} active={item.liked}>{likeText}</Text>
            </View>
            <View style={styles.Interaction}>
                <Ionicons name="md-chatbubble-outline" size={25}/>
                <Text style={styles.InteractionText}>{commentText}</Text>
            </View>
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
        height: 250,        
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
        backgroundColor: props => props.active ? '#2e64e515' : 'transparent',
    },
    InteractionText:{
        fontSize: 12,
        fontFamily: 'Lato-Regular',
        fontWeight: 'bold',
        color:  props => props.active ? '#2e64e515' : 'transparent',
        marginTop: 5,
        marginLeft: 5,
    }

})