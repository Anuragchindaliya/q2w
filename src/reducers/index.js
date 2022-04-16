import roomIdReducer, { roomIdInitial } from "./roomId.reducer";
import roomIdSubmitReducer, {
  roomIdSubmitInitial,
} from "./roomIdSubmit.reducer";
import roomContentReducer, { roomContentInitial } from "./roomContent.reducer";
import roomContentSubmitReducer, {
  roomContentSubmitInitial,
} from "./roomContentSubmit.reducer";
import roomInfoReducer, { roomInfoInitial } from "./roomInfo.reducer";
import roomPasswordReducer, {
  roomPasswordInitial,
} from "./roomPassword.reducer";
import roomLinksReducer, { roomLinksInitial } from "./roomLinks.reducer";

const allReducers = {
  roomId: [roomIdReducer, roomIdInitial],
  roomIdSubmit: [roomIdSubmitReducer, roomIdSubmitInitial],
  roomPassword: [roomPasswordReducer, roomPasswordInitial],
  roomContent: [roomContentReducer, roomContentInitial],
  roomContentSubmit: [roomContentSubmitReducer, roomContentSubmitInitial],
  roomInfo: [roomInfoReducer, roomInfoInitial],
  roomLinks: [roomLinksReducer, roomLinksInitial],
};
export default allReducers;
