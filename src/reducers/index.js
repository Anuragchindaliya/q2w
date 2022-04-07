import roomIdReducer, { roomIdInitial } from "./roomId.reducer";
import roomIdSubmitReducer, {roomIdSubmitInitial} from "./roomIdSubmit.reducer";
import roomContentReducer, { roomContentInitial } from "./roomContent.reducer";
import roomContentSubmitReducer, {roomContentSubmitInitial} from "./roomContentSubmit.reducer";
import roomInfoReducer, { roomInfoInitial } from "./roomInfo.reducer";

const allReducers = {
  roomId: [roomIdReducer, roomIdInitial],
  roomIdSubmit: [roomIdSubmitReducer, roomIdSubmitInitial],
  roomContent: [roomContentReducer, roomContentInitial],
  roomContentSubmit: [roomContentSubmitReducer, roomContentSubmitInitial],
  roomInfo: [roomInfoReducer, roomInfoInitial],
};
export default allReducers;
