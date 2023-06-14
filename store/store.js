import { configureStore } from "@reduxjs/toolkit";
import CustomRecipeSlice from "./CustomRecipeSlice";

export const store = configureStore({
  reducer: {
    IngredientList: CustomRecipeSlice,
  },
});