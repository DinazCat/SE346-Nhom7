import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [
    
  ],
  isCustomFood: false,
  totalCalories: ''
};

export const CustomFoodSlice = createSlice({
  name: "CustomFood",
  initialState,
  reducers: {
    isAdd: {
      reducer: (state, action) => {
        state.isCustomFood = action.payload.isAdd;
      },
      prepare: (isAdd) => {
        return {payload:{isAdd}}
      }
    },
    createNew: {
      reducer: (state, action) => {
        state.value = []
        state.totalCalories = ''
      },
      
    },
    Add: {
      reducer: (state, action) => {
        state.value = [...state.value, action.payload]
        let total = 0
        for(let i = 0; i < state.value.length; i++){
          total += parseInt(state.value[i].resultCalories);
        }
        state.totalCalories = total
          
      },
      prepare: (image, name, calories, unit, baseAmount, resultCalories) => {
        return { payload: {image: image, name: name, calories: calories, unit: unit, baseAmount:baseAmount, resultCalories: resultCalories} }
      }
    },
    
    Delete: {
      reducer: (state, action) => {
        let arr = [];
        for(let i = 0; i < state.value.length; i++){
            if (i != action.payload.index){
              arr.push(state.value[i]);
            }
        }
        state.value = arr;
      },
      prepare: (index) => {
        return { payload: {index} }
      }
    }
    
  },
});

export const { isAdd, createNew, Add} = CustomFoodSlice.actions;

export default CustomFoodSlice.reducer;