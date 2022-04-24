export const roomLinksInitial = {
  urls: [],
  numbers: [],
};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ROOM_LINKS_UPDATE":
      const { urls, numbers } = payload;
      return { ...state, ...(urls && { urls }), ...(numbers && { numbers }) };
    case "ROOM_LINKS_RESET":
      return roomLinksInitial;
    default:
      return state;
  }
};
export default reducer;
