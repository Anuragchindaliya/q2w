export const roomInfoInitial = {
  ip: "",
  last_modified: "",
  saveMsg: "saved.",
};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ROOM_INFO_UPDATE":
      const { ip, last_modified, saveMsg } = payload;
      return {
        ...state,
        ...(ip && { ip }),
        ...(last_modified && { last_modified }),
        ...(saveMsg && { saveMsg }),
      };
    default:
      return state;
  }
};
export default reducer;
