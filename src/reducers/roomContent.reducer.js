export const roomContentInitial = {
  content: null,
};
const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "ROOM_CONTENT_UPDATE":
      return { ...state, content: payload };
    case "ROOM_CONTENT_RESET":
      return roomContentInitial;
    default:
      return state;
  }
};
export default reducer;
