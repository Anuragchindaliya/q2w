export const roomContentInitial = {
  content: "",
};
const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "ROOM_CONTENT_UPDATE":
      return { ...state, content: payload };
    default:
      return state;
  }
};
export default reducer;
