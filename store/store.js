import { configureStore } from "@reduxjs/toolkit";
import CustomRecipeSlice from "./CustomRecipeSlice";
import CaloriesDiarySlice from "./CaloriesDiarySlice";

export const store = configureStore({
  reducer: {
    IngredientList: CustomRecipeSlice,
    CaloriesDiary: CaloriesDiarySlice,
  },
});