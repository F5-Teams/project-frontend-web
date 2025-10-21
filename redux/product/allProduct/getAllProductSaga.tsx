import api from "@/config/axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET__ALL__PRODUCT,
  getAllProductSuccess,
  getAllProductFail,
} from "./getAllProductSlice";
import { Product } from "./allProduct";

interface ApiResponse {
  data: Product[];
  status: number;
}

export function* getAllProductSaga() {
  try {
    const response: ApiResponse = yield call(api.get, "/products");
    if (response.status === 200 || response.status === 201) {
      yield put(getAllProductSuccess(response.data));
    } else {
      yield put(getAllProductFail("Unexpected status code"));
    }
  } catch (error: any) {
    yield put(getAllProductFail(error.message));
  }
}

export default function* watchGetAllProduct() {
  yield takeLatest(GET__ALL__PRODUCT, getAllProductSaga);
}
