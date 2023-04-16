import { StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput } from 'react-native'
import React, {useEffect, useContext, useState, useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostComment from '../components/PostComment';

const CommentScreen = ({navigation}) => {
  const route = useRoute();
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const inputRef = useRef();
  const {user} = useContext(AuthContext);

  useEffect(() => {
    postId = route.params.postId;
    comments = route.params.comments;
    setCommentsList(comments);
  }, []);

  const handlePostComment = () => {
    if(comment.length > 0){
      let temComments = comments;
      temComments.push({
        userId: user.uid,
        comment: comment,
        postId: postId,
        name: user.displayName,
        profile: user.photoURL,
      });
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          comments: temComments,
        })
        .then(() => {
          console.log('post updated comment!');
          getNewComments();
        })
        .catch(error => {});
      inputRef.current.clear();
    }
  };
  const getNewComments = () => {
    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        setCommentsList(documentSnapshot.data().comments);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('feedsScreen')}>
            <Ionicons 
                name="arrow-back"
                size={28}
                backgroundColor='transparent'
                color="#333"                            
                />
        </TouchableOpacity>
        <Text style={styles.headerText}>Comments</Text>       
      </View>
      <FlatList
        data={commentsList}
        renderItem={({item}) => (
            <PostComment
                item={item}
                onUserPress={() => navigation.navigate('profileScreen', {userId: item.userId})}/>
        )}
        />
      <View
        style={styles.bottomViewContainer}>
        <TextInput
          ref={inputRef}
          value={comment}
          onChangeText={txt => {
            setComment(txt);
          }}
          placeholder="Type comment here..."
          multiline={true}
          style={styles.commentInput}
        />
        <Text
          style={{marginRight: 10, fontSize: 18, fontWeight: '600'}}
          onPress={() => {handlePostComment()}}>
          Send
        </Text>
      </View>
    </View>
  )
}

export default CommentScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    headerContainer:{
        flexDirection: 'row',
        paddingBottom: 8,
        marginBottom: 5,
        borderBottomColor: '#DFDCDC',
        borderBottomWidth: 1,
    },
    headerText:{
        fontSize: 20,
        marginLeft: 20,
        color: '#333'
    },
    commentInput:{
        width: '80%',
        marginLeft: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#999',
        padding: 6,
    },
    bottomViewContainer:{
        width: '100%',
        height: 60,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
      }
})