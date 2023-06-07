import { configureStore } from "@reduxjs/toolkit";
import CustomFoodSlice from "./CustomFoodSlice";
import isQuestionNullSlice from "./isQuestionNullSlice";

export const store = configureStore({
  reducer: {
    IngredientList: CustomFoodSlice,
    isQuestionNull: isQuestionNullSlice
  },
});