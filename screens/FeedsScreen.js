import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import PostCard from '../components/PostCard';

const Posts = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/food.png'),
    postTime: '4 mins ago',
    postText:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/food.png'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/food.png'),
    postTime: '2 hours ago',
    postText:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '8',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/food.png'),
    postTime: '1 hours ago',
    postText:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/food.png'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/food.png'),
    postTime: '1 day ago',
    postText:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/food.png'),
    liked: true,
    likes: '22',
    comments: '4',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/food.png'),
    postTime: '2 days ago',
    postText:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '0',
    comments: '0',
  },
];

export default function FeedsScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <FormButton title='Logout' onPress={() => logout()}></FormButton>
      <TouchableOpacity>
        <Image style={styles.UserImage} source={{uri: user.photoURL}}/>
      </TouchableOpacity>
      <FlatList
            data={Posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                //onDelete={handleDelete}
                //onPress={() =>
                //  navigation.navigate('HomeProfile', {userId: item.userId})
                //}
              />
            )}
            keyExtractor={(item) => item.id}
            // ListHeaderComponent={ListHeader}
            // ListFooterComponent={ListHeader}
            showsVerticalScrollIndicator={false}             
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  UserImage:{
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
})
