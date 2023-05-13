import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image } from 'react-native'
import React, {useEffect, useContext, useState, useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import FeedsScreen from './FeedsScreen';
const EditComment = ({navigation}) => {
    const route = useRoute();
    const item =  route.params.item;
    const cmtId = route.params.cmtId;
    const onCommentUpdated = route.params?.onCommentUpdated;
    const [comment, setComment] = useState(item.comment);
    handleSave = () => {
      let temComment = {
        userId: item.userId,
        comment: comment,
        postId: item.postId,
        name: item.name,
        profile: item.profile
      }
      const postRef = firestore().collection('posts').doc(postId);
      postRef
        .get()
        .then((postDoc) => {
            if (postDoc.exists) {
              const post = postDoc.data();
              const comments = post.comments;
              if (comments && comments.length > cmtId) {
                comments[cmtId] = temComment;                
                return postRef.update({ comments });
              } else {
                console.log('Comment index is invalid');
              }
            } else {
              console.log('Post does not exist');
            }
          })
          .then(() => {
            console.log('Comment updated successfully');
            onCommentUpdated();
            navigation.goBack();
          })
          .catch((error) => {
            console.log(error);
          });
    }
  return (
    <View style={styles.container}>
        <View style={styles.cmtContainer}>
            <Image
                source={{uri: item.profile ? item.profile : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'}}
                style={styles.image}/>
            <View style={styles.textContainer}>
                <Text style={{fontSize: 16, fontWeight: '600'}}>
                    {item.name}
                </Text>
                <TextInput multiline style={{fontSize: 16}}
                autoFocus={true}
                value={comment}
                onChangeText={txt => {
                  setComment(txt);
                }}/>
            </View>
        </View> 
        <View style={styles.cmtContainer}>
            <TouchableOpacity onPress={() => handleSave()}
                style={[styles.buttonContainer, {backgroundColor: '#777'}]}>
                <Text style={[styles.buttontext, {color: '#fff'}]}>Lưu</Text>
            </TouchableOpacity>  
            <TouchableOpacity onPress={() => navigation.goBack()}
                style={styles.buttonContainer}>
                <Text style={styles.buttontext}>Hủy</Text>
            </TouchableOpacity>  
        </View>         
    </View>
  )
}

export default EditComment

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    cmtContainer:{
        width: '100%',
        flexDirection: 'row',
        marginVertical: 3,     
    },
    image:{
        width: 45,
        height: 45,
        marginRight: 10,
        borderRadius: 22,
    },
    textContainer:{
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 4,
        paddingHorizontal: 8
    },
    buttonContainer:{
        padding: 5, 
        borderRadius: 10,
        paddingHorizontal: 10,
        marginLeft: 50,
        marginTop: 5,
    },
    buttontext:{
        fontSize: 16,
        fontWeight: '600',     
    }
})