import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, {useState, useRef} from 'react'
import Popover from 'react-native-popover-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';

const PostComment = ({item, onUserPress, onEdit, onDelete}) => {
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);


  const handleLongPress = (event) => {
    if(item.userId == auth().currentUser.uid)
    setPopoverAnchor(event.nativeEvent.target);
    setPopoverVisible(true);
  };

  const handleEditComment = () => {
    onEdit(item); 
    setPopoverVisible(false);
  };

  const handleDeleteComment = () => {
    onDelete(item); 
    setPopoverVisible(false);
  };

  return (
    <TouchableOpacity onLongPress={handleLongPress}        
        style={styles.container}>
        <TouchableOpacity onPress={onUserPress}>
            <Image
                source={{uri: item.profile ? item.profile : 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'}}
                style={styles.image}
            />
        </TouchableOpacity>
        
        <View style={styles.textContainer}>
            <Text style={{fontSize: 16, fontWeight: '600'}}>
                {item.name}
            </Text>
            <Text multiline style={{fontSize: 16, fontWeight: '600', marginTop: 3}}>
                {item.comment}
            </Text>
        </View>
        <Popover
            isVisible={isPopoverVisible}
            onRequestClose={() => setPopoverVisible(false)}
            fromView={popoverAnchor}>
            <View style={styles.popover}>              
                <TouchableOpacity onPress={handleEditComment}>
                    <View style={styles.popoverItem}>
                        <Icon name="edit" size={35} color="black" />
                        <Text style={{ fontSize: 16, marginTop: 8, color: 'black' }}>Sửa bình luận</Text>
                    </View>
                </TouchableOpacity>           
                <TouchableOpacity onPress={handleDeleteComment}>
                    <View style={styles.popoverItem}>
                        <Icon name="trash-alt" size={35} color="black" />
                        <Text style={{ fontSize: 16, marginTop: 8, color: 'black' }}>Xóa bình luận</Text>
                    </View>
                </TouchableOpacity>
            </View>
      </Popover>
    </TouchableOpacity>
  )
}

export default PostComment

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 3,       
    },
    textContainer:{
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 4,
        paddingHorizontal: 8
    },
    image:{
        width: 45,
        height: 45,
        marginRight: 10,
        borderRadius: 22,
    },
    popover:{
        backgroundColor: 'white', 
        borderRadius: 10, 
        padding: 16, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    popoverItem:{
        alignItems: 'center',
        margin: 20
    }
})