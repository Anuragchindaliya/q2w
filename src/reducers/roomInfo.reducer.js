export const roomInfoInitial = {
  ip: "",
  last_modified: "",
};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ROOM_INFO_UPDATE":
      const { ip, last_modified } = payload;
      return { ...state, ip, last_modified };
    default:
      return state;
  }
};
export default reducer;
