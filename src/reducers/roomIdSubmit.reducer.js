import { roomIdSubmitTypes } from "../types";
const { FETCH, SUCCESS, ERROR, RESET } = roomIdSubmitTypes;

export const roomIdSubmitInitial = {
  loading: false,
  data: {},
  error: "",
};
const reducer = (state, action) => {
  // console.log(action.payload, "payload")
  const { type, payload } = action;
  switch (type) {
    case FETCH:
      return { ...state, loading: true };
    case SUCCESS: {
      return { ...state, loading: false, data: payload };
    }
    case ERROR:
      return { ...state, loading: false, error: payload };
    case RESET:
      return { ...roomIdSubmitInitial };
    default:
      return state;
  }
};
export default reducer;

// data format
// "id": "1",
// "pass": "5f4dcc3b5aa765d61d8327deb882cf99",
// "ip": "::1",
// "room_id": "anurag",
// "content": "new content \r\nchange change",
// "created_at": "2022-01-20 16:59:45",
// "last_modified": "2022-03-31 13:51:40"
