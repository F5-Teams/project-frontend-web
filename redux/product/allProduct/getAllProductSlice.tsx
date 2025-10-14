import { Product } from "./allProduct";

export const GET__ALL__PRODUCT = "GET__ALL__PRODUCT" as const;
export const GET__ALL__PRODUCT__SUCCESS = "GET__ALL__PRODUCT__SUCCESS" as const;
export const GET__ALL__PRODUCT__FAIL = "GET__ALL__PRODUCT__FAIL" as const;

export const getAllProduct = () => ({
  type: GET__ALL__PRODUCT,
});

export const getAllProductSuccess = (data: Product[]) => ({
  type: GET__ALL__PRODUCT__SUCCESS,
  payload: data,
});

export const getAllProductFail = (error: string) => ({
  type: GET__ALL__PRODUCT__FAIL,
  payload: error,
});

interface GetAllProductState {
  allProduct: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: GetAllProductState = {
  allProduct: [],
  loading: false,
  error: null,
};

type GetAllProductAction =
  | ReturnType<typeof getAllProduct>
  | ReturnType<typeof getAllProductSuccess>
  | ReturnType<typeof getAllProductFail>;

const getAllProductReducer = (
  state = initialState,
  action: GetAllProductAction
): GetAllProductState => {
  switch (action.type) {
    case GET__ALL__PRODUCT:
      return { ...state, loading: true, error: null };
    case GET__ALL__PRODUCT__SUCCESS:
      return { ...state, loading: false, allProduct: action.payload };
    case GET__ALL__PRODUCT__FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default getAllProductReducer;
export type { GetAllProductState };
