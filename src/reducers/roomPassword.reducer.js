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

export const roomPasswordInitial = {
  password: getLocalStorageObj("localRoomId", "password") || "",
};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ROOM_PASSWORD_CHANGE":
      return { ...state, password: payload };
    case "ROOM_PASSWORD_RESET":
      return { password: "" };
    default:
      return state;
  }
};
export default reducer;
