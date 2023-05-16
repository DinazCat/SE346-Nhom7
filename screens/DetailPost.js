import React, {useEffect, useState, useContext} from 'react';
import {View, ScrollView, Text, StyleSheet, FlatList,Button,TouchableOpacity,Image, alert} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import PostCard from '../components/PostCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';

export default function DetailPostScreen({navigation,route}) {
    onUserPress=() => navigation.navigate('profileScreen', {userId: route.params.item.userId})
    const Item = ({each}) => (
        <Image style={[styles.PostImgsContainer, {height: each ? 250 : 0}]} 
        source={{uri:each}} />
      );
      useEffect(() => {
        console.log(route.params.item.userName);
    })
    return (
        <View style={styles.Container}>
            <View style={styles.UserInfoContainer}>
                <TouchableOpacity onPress={onUserPress}>
                    <Image style={styles.UserImage} source={{uri: route.params.item.userImg}}/>
                </TouchableOpacity>            
                <View style={styles.UserInfoTextContainer}>
                    <TouchableOpacity onPress={onUserPress}>
                        <Text style={styles.UsernameText}>{route.params.item.userName}</Text>
                    </TouchableOpacity>                
                    <Text style={styles.PostTime}>{route.params.item.postTime}</Text>
                </View>
            </View>
    
            <Text style={styles.PostText}>{route.params.item.postText}</Text>
    
            {/* <Image style={[styles.PostImgsContainer, {height: item.postImg[0] ? 250 : 0}]} 
                source={{uri:item.postImg[0]}} />    */}
                
        {/* <FlatList
        data={route.params.item.postImg}
        renderItem={(item) => <Item each={item} />}
        keyExtractor={item => item}
        /> */}
        <View style={[styles.Container,{height:650}]}>
        <ScrollView style={{flexDirection:'column'}}>
            {
              route.params.item.postImg.map((each,key)=>{
                return(  
                    <View key={key}>
                      <Image source={{uri:each}} style={{height:300, width:400, marginTop:5}} resizeMode='cover'/>
                    </View>     
                );
              })
             
            }
  
          </ScrollView>
        </View>
        
          
        </View>
      )
    // return(
    //     <View>
    //         <Text>Hahahah</Text>
    //     </View>
    // )
    }
    
  
    const styles = StyleSheet.create({
        Container:{
            backgroundColor: '#1C1C1C',
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
            color:"white",
            fontFamily: 'Lato-Regular',
        },
        PostTime:{
            fontSize: 12,
            color:"white",
            fontFamily: 'Lato-Regular',
            color: '#666',
        },
        PostText:{
            fontSize: 14,
            fontFamily: 'Lato-Regular',
            color:"white",
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
