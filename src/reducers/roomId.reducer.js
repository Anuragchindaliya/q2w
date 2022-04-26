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
  roomType:
    (getLocalStorageObj("localRoomId", "password") && "secure") || "public",
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ROOM_ID_CHANGE":
      return { ...state, id: payload };
    case "ROOM_TYPE_UPDATE":
      return { ...state, roomType: payload };
    case "ROOM_ID_RESET":
      return roomIdInitial;
    default:
      return state;
  }
};
export default reducer;
