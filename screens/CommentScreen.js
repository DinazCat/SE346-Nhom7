import { StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput } from 'react-native'
import React, {useEffect, useContext, useState, useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthProvider';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostComment from '../components/PostComment';
import SendNoti from '../components/SendNoti';
import LanguageContext from "../context/LanguageContext";

const CommentScreen = ({navigation}) => {
  const route = useRoute();
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const inputRef = useRef();
  const {user} = useContext(AuthContext);
  const onCommentChanged = route.params.onCommentChanged
  const language = useContext(LanguageContext);

  useEffect(() => {
    postId = route.params?.postId;  
    fetchComments();
  }, [route.params?.comments]);

  const fetchComments = async() => {
    firestore()
    .collection('posts')
    .doc(postId)
    .onSnapshot((documentSnapshot) => {
    if (documentSnapshot.exists) {
        const comments = documentSnapshot.data().comments || [];
        setCommentList(comments);
    } else {
        console.log('Document does not exist');
    }
    })
    .catch((error) => {
        console.log('Error getting document:', error);
    });
  }

  const handlePostComment = () => {
    if(comment.length > 0){
      let temComments = commentList;
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
          setComment('');
          getNewComments();
          onCommentChanged();
        })
        .catch(error => {});
      inputRef.current.clear();
      //add notification
      if(route.params.postOwner != auth().currentUser.uid){
      firestore().collection('Notification').add({
        PostownerId: route.params.postOwner,
        guestId: auth().currentUser.uid,
        guestName:auth().currentUser.displayName ,
        guestImg:auth().currentUser.photoURL,
        classify:'Cmt',
        time:firestore.Timestamp.fromDate(new Date()),
        text: auth().currentUser.displayName+' đã bình luận bài viết của bạn về món ăn: '+ route.params.Foodname,
        postid: route.params?.postId,
        Read:'no',

      }).then().catch((e)=>{console.log("error "+ e); console.log( auth().currentUser.uid)});
      firestore()
        .collection('NotificationSetting')
        .doc(route.params.postOwner)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            try {
              const gt = data.comment;
              if (gt === true) {
                SendNoti(
                  auth().currentUser.displayName +
                    ' đã bình luận bài viết của bạn về món ăn: ' +
                    route.params.Foodname,
                  route.params.postOwner,
                );
              }
            } catch {}
          }
        });
      }
    }
  };
  handleDeleteComment = (item, index) =>{
    let temComments = commentList;
      temComments.splice(index, 1);
      firestore()
        .collection('posts')
        .doc(postId)
        .update({
          comments: temComments,
        })
        .then(() => {
          console.log('Comment deleted successfully');
          getNewComments();
          onCommentChanged();
        })
        .catch(error => {
          console.log('Error deleting comment: ', error);
        });
  }
  
  const getNewComments = () => {
    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        setCommentList(documentSnapshot.data().comments);
      });
  };

  const handleCommentUpdated = () => {
    getNewComments();
    onCommentChanged();
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
        <Text style={styles.headerText}>{language === 'vn' ? 'Bình luận' : 'Comments'}</Text>       
      </View>
      <FlatList
        data={commentList}
        renderItem={({item, index}) => (
            <PostComment
                item={item}
                onUserPress={() => navigation.navigate('profileScreen', {userId: item.userId})}
                onDelete={() => handleDeleteComment(item, index)}
                onEdit={() => navigation.navigate('editComment', {
                  item: item,
                  cmtId: index,
                  onCommentUpdated: handleCommentUpdated 
                })}/>
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
          placeholder={language === 'vn' ? 'Viết bình luận...' : 'Type comment here...'}
          multiline={true}
          style={styles.commentInput}
        />
        <Text
          style={{marginRight: 10, fontSize: 18, fontWeight: '600'}}
          onPress={() => {handlePostComment()}}>
          {language === 'vn' ? 'Gửi' : 'Send'}
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
        marginBottom: 50
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