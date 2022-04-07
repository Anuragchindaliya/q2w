import { actionTypeCreator } from "../utils";

// {
//     FETCH: `${type}_FETCH`,
//     SUCCESS: `${type}_SUCCESS`,
//     ERROR: `${type}_ERROR`,
//     RESET: `${type}_RESET`,
// };
export const roomIdSubmitTypes = actionTypeCreator("ROOM_ID");
export const roomContentSubmitTypes = actionTypeCreator("ROOM_CONTENT");
