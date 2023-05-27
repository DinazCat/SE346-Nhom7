import { StyleSheet, Text, View, Image, TouchableOpacity, useContext, Modal,alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Menu, MenuOption, MenuOptions, MenuTrigger, MenuProvider} from 'react-native-popup-menu'
import { AuthContext } from '../navigation/AuthProvider';
import Animated, { Easing } from 'react-native-reanimated';
import Share from 'react-native-share';
import SendNoti from './SendNoti';

const PostCard = ({item, onUserPress, onCommentPress,onImagePress,deletePost,editright,editPost}) => {

    const [liked, setLiked] = useState();
    const [Allow, SetAllow] = useState(false);
    const [defaultRating, setdefaulRating] = useState(item.postFoodRating);
    const [maxRating, setmaxRating] = useState([1,2,3,4,5])
    const starImgFilled = "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
    const starImgCorner = "https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png";

    useEffect(() => {
        getLikeStatus(item.likes);
        allow();
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
            if (!flag) {
              tempLikes.push(auth().currentUser.uid);
               //add notification
               if(item.userId != auth().currentUser.uid)
              firestore().collection('Notification').add({
                PostownerId: item.userId,
                guestId: auth().currentUser.uid,
                guestName: auth().currentUser.displayName,
                guestImg:auth().currentUser.photoURL,
                classify:'Like',
                time:firestore.Timestamp.fromDate(new Date()),
                text: auth().currentUser.displayName+' đã thích bài viết của bạn về món ăn: '+ item.postFoodName,
                postid: item.postId,
                Read:'no',
      
              });
              SendNoti( auth().currentUser.displayName+' đã thích bài viết của bạn về món ăn: '+ item.postFoodName,item.userId);
            }                    
        } 
        else {
          tempLikes.push(auth().currentUser.uid);
          if(item.userId != auth().currentUser.uid)
          firestore().collection('Notification').add({
            PostownerId: item.userId,
            guestId: auth().currentUser.uid,
            guestName: auth().currentUser.displayName,
            guestImg:auth().currentUser.photoURL,
            classify:'Like',
            time:firestore.Timestamp.fromDate(new Date()),
            text: auth().currentUser.displayName+' đã thích bài viết của bạn về món ăn: '+ item.postFoodName,
            postid: item.postId,
            Read:'no',
  
          });
          SendNoti( auth().currentUser.displayName+' đã thích bài viết của bạn về món ăn: '+ item.postFoodName, item.userId);
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

      const onSharePost = () => {
        const postLink = 'https://foodblog?postId=' + item.postId;
        const shareMessage = `Tên món ăn: ${item.postFoodName}\nĐộ khó: ${item.postFoodRating}\nNguyên liệu: ${item.postFoodIngredient}\nCách làm: ${item.postFoodMaking}\nTổng kết: ${item.postFoodSummary}\n\nXem thêm tại: ${postLink}`;
        const options = {
          title: 'Chia sẻ bài đăng',
          message: shareMessage,
        };                      
        Share.open(options)
          .catch((err) => {
            console.log('Error when sharing:', err);
          });
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
      const CustomRatingBar = () => {
        return (
          <View style={styles.customRatingBarStyle}>
            {
              maxRating.map((item, key)=>{
                return (
                    <Image key={key} style={styles.starImgStyle}
                    source={item <= defaultRating ? {uri: starImgFilled} : {uri:starImgCorner}}/>
                )
              })
            }
          </View>
        )
      }
     // const {user} = useContext(AuthContext);
      function allow()
      {
        if( auth().currentUser.uid ===  item.userId)
        {
          SetAllow(true);
        }
        else SetAllow(false);
      }
      const PopupMenu = () =>{
        const[visible,setvisible] = useState(false);
        const options = [
          {
            title:'Xóa',
            action:()=>{
              deletePost(item.id)
            },

          },
          {
            title:'Sửa',
            action:()=>{
              editPost();
            },
          }
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
                <Icon name={'ellipsis-h'}  />
            </TouchableOpacity>
          </View>
        )
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
            <View style={{flex:1}}/>
          {(Allow && editright ) && <PopupMenu/>}
           
        </View>
        <View style={{flexDirection:"row"}}>
        <Text style={styles.PostTitle}>Tên món ăn:</Text>
        <Text style={styles.PostText}>{item.postFoodName}</Text>
        </View>
        <View style={{flexDirection:"row"}}>
        <Text style={styles.PostTitle}>Độ khó:</Text>
        <CustomRatingBar/>
        </View>
        <TouchableOpacity onPress={onImagePress}>
          <Text style={{textDecorationLine:'underline', color:'blue',paddingHorizontal: 15,
        marginBottom: 10,}}>See Detail</Text>
        </TouchableOpacity>
        {/* <Text style={styles.PostTitle}>Nguyên liệu:</Text>
        <Text style={styles.PostText}>{item.postFoodIngredient}</Text>
        <Text style={styles.PostTitle}>Cách làm:</Text>
        <Text style={styles.PostText}>{item.postFoodMaking}</Text>
        <Text style={styles.PostTitle}>Tổng kết:</Text>
        <Text style={styles.PostText}>{item.postFoodSummary}</Text> */}

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
            <TouchableOpacity onPress={onSharePost}>
                <View style={styles.Interaction}>
                    <Ionicons name="arrow-redo-outline"size={25}/>
                    <Text style={styles.InteractionText}>Share</Text>
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
        marginBottom: 10,
    },
    PostTitle:{
        fontSize: 16,
        fontFamily: 'Lato-Regular',
        paddingHorizontal: 15,
        marginBottom: 10,
        fontWeight:"600",
        color:"black"
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
    },
    customRatingBarStyle:{
        flexDirection:"row",
        marginLeft:12,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    starImgStyle:{
        width:20,
        height:20,
        resizeMode:'cover'
    },
    MenuButton:{
      color: 'black', 
      fontSize: 30, 
      padding: 10,
      alignSelf:"center",
    },
    popup:{
      borderRadius:8,
      borderColor:'#333',
      borderWidth:1,
      backgroundColor:'#fff',
      width:50,
      height:65,
      textAlign:'center',
    },
    popupitem:
    {
      borderBottomColor:'black', 
      alignItems:'center', 
      width:35, 
      alignSelf:'center',
      paddingVertical:5
    }

})