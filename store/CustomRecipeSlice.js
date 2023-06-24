import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [
    
  ],
  totalCalories: '',
  isEdit: false,
  id: '',
  totalCarbs: 0,
  totalFat: 0,
  totalProtein: 0
};

export const CustomRecipeSlice = createSlice({
  name: "CustomRecipe",
  initialState,
  reducers: {
    
    
    createNew: {
      reducer: (state, action) => {
        state.value = []
        state.totalCalories = '';
        state.totalCarbs = 0;
        state.totalFat = 0;
        state.totalProtein = 0;
        state.isEdit = false;
      },
      
    },
    Add: {
      reducer: (state, action) => {
        let index = state.value.findIndex(item=>item.name === action.payload.name);
        if (index < 0){
          state.value = [...state.value, action.payload]
        }
        else{
          state.value[index].amount = parseInt(state.value[index].amount) +  parseInt(action.payload.amount);
          state.value[index].resultCalories = parseInt(action.payload.resultCalories) + parseInt(state.value[index].resultCalories);
          state.value[index].fat = parseInt(action.payload.fat) + parstInt(state.value[index].fat);
          state.value[index].protein = parseInt(action.carbs) + parseInt(state.value[index].protein);
        }
        let totalCal = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalProtein = 0;
        for(let i = 0; i < state.value.length; i++){
          totalCal += parseInt(state.value[i].resultCalories);
          totalCarbs += parseInt(state.value[i].carbs);
          totalFat += parseInt(state.value[i].fat);
          totalProtein += parseInt(state.value[i].protein);
        }
        state.totalCalories = totalCal;
        state.totalCarbs = totalCarbs;
        state.totalFat = totalFat;
        state.totalProtein = totalProtein;
          
      },
      prepare: (image, name, calories, unit, baseAmount, resultCalories, amount, carbs, fat, protein) => {
        return { payload: {image: image, name: name, calories: calories, unit: unit, baseAmount:baseAmount, resultCalories: resultCalories, amount: amount, carbs: carbs, fat: fat, protein: protein} }
      }
    },
    
    Delete: {
      reducer: (state, action) => {
        let arr = [];
        let totalCal = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalProtein = 0;
        for(let i = 0; i < state.value.length; i++){
            if (i != action.payload.index){
              arr.push(state.value[i]);
              totalCal += parseInt(state.value[i].resultCalories);
              totalFat += parseInt(state.value[i].fat);
              totalProtein += parseInt(state.value[i].protein);
              totalCarbs += parseInt(state.value[i].carbs);
            }
        }
        state.value = arr;
        state.totalCalories = totalCal;
        state.totalCarbs = totalCarbs;
        state.totalFat = totalFat;
        state.totalProtein = totalProtein;
      },
      prepare: (index) => {
        return { payload: {index} }
      }
    },
    DeleteAll: {
      reducer: (state, action) => {
        state.totalCalories = 0;
        state.totalCarbs = 0;
        state.totalFat = 0;
        state.totalProtein = 0;
        state.value = [];
      }
    },
    Edit: {
      reducer: (state, action) => {
        const {name, image, resultCalories, amount, carbs, fat, protein} = action.payload.ingredienList;
        state.isEdit = action.payload.isEdit;
        state.totalCalories = action.payload.totalCalories;
        state.totalCarbs = action.payload.totalCarbs;
        state.totalFat = action.payload.totalFat;
        state.totalProtein = action.payload.totalProtein;
        state.id = action.payload.id;
        state.value = [];
        state.value = state.value.concat(action.payload.ingredienList);
      },
      prepare: (isEdit, ingredienList, totalCalories, totalFat, totalCarbs, totalProtein) => {
        return {payload:{isEdit, ingredienList, totalCalories, totalFat, totalCarbs, totalProtein}}
      }
    },
    
    
  },
});

export const { createNew, Add, Edit, Delete, DeleteAll} = CustomRecipeSlice.actions;

export default CustomRecipeSlice.reducer;