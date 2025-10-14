import { productPublic } from "./getPublic";

export const GET__PRODUCT__PUBLIC = "GET__PRODUCT__PUBLIC" as const;
export const GET__PRODUCT__PUBLIC__SUCCESS =
  "GET__PRODUCT__PUBLIC__SUCCESS" as const;
export const GET__PRODUCT__PUBLIC__FAIL = "GET__PRODUCT__PUBLIC__FAIL" as const;

export const getProductPublic = () => ({
  type: GET__PRODUCT__PUBLIC,
});

export const getProductPublicSuccess = (data: productPublic[]) => ({
  type: GET__PRODUCT__PUBLIC__SUCCESS,
  payload: data,
});

export const getProductPublicFail = (error: string) => ({
  type: GET__PRODUCT__PUBLIC__FAIL,
  payload: error,
});

interface GetProductPublicState {
  productPublic: productPublic[];
  loading: boolean;
  error: string | null;
}

const initialState: GetProductPublicState = {
  productPublic: [],
  loading: false,
  error: null,
};

type GetProductPublicAction =
  | ReturnType<typeof getProductPublic>
  | ReturnType<typeof getProductPublicSuccess>
  | ReturnType<typeof getProductPublicFail>;

const getProductPublicReducer = (
  state = initialState,
  action: GetProductPublicAction
): GetProductPublicState => {
  switch (action.type) {
    case GET__PRODUCT__PUBLIC:
      return { ...state, loading: true, error: null };
    case GET__PRODUCT__PUBLIC__SUCCESS:
      return { ...state, loading: false, productPublic: action.payload };
    case GET__PRODUCT__PUBLIC__FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default getProductPublicReducer;
export type { GetProductPublicState };
