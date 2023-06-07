import { createSlice } from "@reduxjs/toolkit";
import React, {useEffect, useState, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const initialState = {
  value: ''
  
};

export const isQuestionNullSlice = createSlice({
  name: "CustomFood",
  initialState,
  reducers: {
    
    isCheck: {
     
      reducer: (state, action) => {
        firestore()
      .collection('bmi')
      .doc(auth().currentUser)
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
          state.value = 'QuestionStack';
        }
        else {
          if (documentSnapshot.data().activityLevel != null)
            state.value = 'TabsNavigator';
          else{
            state.value = 'QuestionStack';
          }
        }
      });
      },
      
    },
    
    
    
    
  },
});

export const { isCheck} = isQuestionNullSlice.actions;

export default isQuestionNullSlice.reducer;