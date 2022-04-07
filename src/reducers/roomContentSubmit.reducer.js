import { roomContentSubmitTypes } from "../types";
const { FETCH, SUCCESS, ERROR, RESET } = roomContentSubmitTypes;

export const roomContentSubmitInitial = {
  loading: false,
  data: {},
  error: "",
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH:
      return { ...state, loading: true };
    case SUCCESS: {
      return { ...state, loading: false, data: payload };
    }
    case ERROR:
      return { ...state, loading: false, error: action.payload };
    case RESET:
      return { ...roomContentSubmitInitial };
    default:
      return state;
  }
};
export default reducer;
