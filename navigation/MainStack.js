import React, {useEffect, useState, useContext} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsNavigator from './TabsNavigator';
import firestore from '@react-native-firebase/firestore';
import QuestionStack from './QuestionStack';
import { AuthContext } from '../navigation/AuthProvider';
import { useSelector } from "react-redux";


const MainStack = () => {

  const [initialScreen, setInitialScreen] = useState('');
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
        }
        else {
          if (documentSnapshot.data().activityLevel != null)
            setInitialScreen('TabsNavigator')
          else{
            setInitialScreen('QuestionStack');
          }
        }
      });
  };
  useEffect(() => {
    isQuestionNull();
  }, []);

  return (
    (initialScreen == 'TabsNavigator')? <TabsNavigator /> : <QuestionStack />
  )
};

export default MainStack;
