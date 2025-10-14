import api from "@/config/axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET__PRODUCT__PUBLIC,
  getProductPublicFail,
  getProductPublicSuccess,
} from "./getPublicSlice";
import { productPublic } from "./getPublic";

interface ApiResponse {
  data: productPublic[];
  status: number;
}

export function* getProductPublicSaga() {
  try {
    const response: ApiResponse = yield call(api.get, "/products/public");
    if (response.status === 200 || response.status === 201) {
      yield put(getProductPublicSuccess(response.data));
    } else {
      yield put(getProductPublicFail(response.status));
    }
  } catch (error: any) {
    yield put(getProductPublicFail(error.message));
  }
}

export default function* watchGetProductPublic() {
  yield takeLatest(GET__PRODUCT__PUBLIC, getProductPublicSaga);
}
