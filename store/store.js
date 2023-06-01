import { configureStore } from "@reduxjs/toolkit";
import CustomFoodSlice from "./CustomFoodSlice";

export const store = configureStore({
  reducer: {
    IngredientList: CustomFoodSlice,
  },
});