import React, {useEffect, useState, useContext} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import QuestionStack from './QuestionStack';
import { AuthContext } from '../navigation/AuthProvider';
import HomePageScreen from '../screens/HomePageScreen';


const MainStack = () => {

  const [initialScreen, setInitialScreen] = useState('');
  const [isLoading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);

  const isQuestionNull = async () => {

    await firestore()
      .collection('bmi')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          firestore().collection('bmi').doc(user.uid).set({
            userID: user.uid,
            age: null,
            height: null,
            weight: null,
            sex: null,
            goal: null,
            weeklyGoal: null,
            activityLevel: null
          }).then().catch((e)=>{console.log("error "+ e)});
          setInitialScreen('QuestionStack');
          setLoading(false);
        }
        else {
          if (documentSnapshot.data().activityLevel != null){
            setInitialScreen('TabsNavigator')
            setLoading(false);
          }
          else{
            setInitialScreen('QuestionStack');
            setLoading(false);
          }
        }
      });
  };
  useEffect(() => {
    isQuestionNull();
  }, []);

  if(isLoading){
    return <ActivityIndicator size="large" color="#0BC25D" style={{marginTop: 15}}/>
  }
  else{
    if (initialScreen == 'TabsNavigator'){
      return <HomePageScreen/>
    }
    else{
      return <QuestionStack/>
    }
  }
};

export default MainStack;
