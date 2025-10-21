import { all } from "redux-saga/effects";
import watchGetAllProduct from "./product/allProduct/getAllProductSaga";
import watchGetProductPublic from "./product/public/getPublicSaga";

export default function* rootSaga() {
  yield all([watchGetAllProduct(), watchGetProductPublic()]);
}
