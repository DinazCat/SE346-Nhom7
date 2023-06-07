import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [
    
  ],
  isCustomFood: false,
  totalCalories: '',
  isEdit: false,
  id: ''
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
        state.isEdit = false;
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
      prepare: (image, name, calories, unit, baseAmount, resultCalories, amount) => {
        return { payload: {image: image, name: name, calories: calories, unit: unit, baseAmount:baseAmount, resultCalories: resultCalories, amount: amount} }
      }
    },
    
    Delete: {
      reducer: (state, action) => {
        let arr = [];
        let total = 0;
        for(let i = 0; i < state.value.length; i++){
            if (i != action.payload.index){
              arr.push(state.value[i]);
              total += parseInt(state.value[i].resultCalories);
            }
        }
        state.value = arr;
        state.totalCalories = total
      },
      prepare: (index) => {
        return { payload: {index} }
      }
    },
    Edit: {
      reducer: (state, action) => {
        const {name, image, resultCalories, amount} = action.payload.ingredienList;
        state.isEdit = action.payload.isEdit;
        state.totalCalories = action.payload.totalCalories;
        state.id = action.payload.id;
        state.value = [];
        state.value = state.value.concat(action.payload.ingredienList);
      },
      prepare: (isEdit, ingredienList, totalCalories) => {
        return {payload:{isEdit, ingredienList, totalCalories}}
      }
    },
    
    
  },
});

export const { isAdd, createNew, Add, Edit, Delete} = CustomFoodSlice.actions;

export default CustomFoodSlice.reducer;