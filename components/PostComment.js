import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const PostComment = ({item, onUserPress}) => {
  return (
    <View
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
    </View>
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
    }

})