import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  time: 'Today',
  baseGoal: 0,
  exercise: 0,
  meal: 0
};

export const CaloriesDiarySlice = createSlice({
  name: "CaloriesDiary",
  initialState,
  reducers: {
    setTime: {
      reducer: (state, action) => {
        state.time = action.payload.time;
      },
      prepare: (time) => {
        return { payload: {time: time} }
      }
    },
    setBaseGoal: {
      reducer: (state, action) => {
        state.baseGoal = action.payload.baseGoal;
      },
      prepare: (baseGoal) => {
        return { payload: {baseGoal: baseGoal} }
      }
    },
    setExercise: {
      reducer: (state, action) => {
        state.exercise = action.payload.exercise;
      },
      prepare: (exercise) => {
        return { payload: {exercise: exercise} }
      }
    },
    
  },
  
});

export const { setTime, setBaseGoal, setExercise} = CaloriesDiarySlice.actions;

export default CaloriesDiarySlice.reducer;