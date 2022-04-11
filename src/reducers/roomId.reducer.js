import { getLocalStorageObj } from "../utils";

// export const roomIdInitial = {
//   id: getLocalStorageObj("localRoomId", "id") || "",
//   resData: { content: "" },
//   saveMsg: "saved.",
//   isAuth: {
//     password: "",
//   },
//   error: "",
// };
export const roomIdInitial = {
  id: getLocalStorageObj("localRoomId", "id") || "",
};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ROOM_ID_CHANGE":
      return { ...state, id: payload };
    case "ROOM_ID_RESET":
      return { id: "" };
    default:
      return state;
  }
};
export default reducer;
