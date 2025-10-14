import { combineReducers } from "@reduxjs/toolkit";
import getAllProductReducer from "./product/allProduct/getAllProductSlice";
import getProductPublicReducer from "./product/public/getPublicSlice";

const rootReducer = combineReducers({
  getAllProduct: getAllProductReducer,
  getProductPublic: getProductPublicReducer,
});
export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
