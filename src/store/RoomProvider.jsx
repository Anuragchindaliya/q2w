import React, { createContext, useReducer, useState } from 'react'
import { useParams } from 'react-router-dom';
import { combineReducers, getLocalStorageObj } from '../utils';
import allReducers from '../reducers';
const [rootReducer, initialStore] = combineReducers(allReducers);
export const RoomContext = createContext(initialStore);

const RoomProvider = ({ children }) => {
  let { roomIdPath } = useParams();
  const [state, dispatch] = useReducer(rootReducer, initialStore);

  const initialState = {
    roomId: roomIdPath || getLocalStorageObj("localRoomId", "id") || "",
    roomContent: "",
    resData: { content: "" },
    saveMsg: "saved.",
    isAuth: {
      password: ""
    },
    error: ""
  }


  // console.log(state.roomId, "reducer initial state");
  // console.log("reducer :", rootReducer, "initial Store :", initialStore, "root reducer")

  const [store, setStore] = useState(initialState);
  // console.log(initialStore, "initial store");

  const setRoomId = (roomName) => {
    setStore({ ...store, roomId: roomName })
  }

  const setRoomContent = (content) => {
    // console.log(content, "content from provider");
    setStore({ ...store, roomContent: content });
  }
  const setResData = (data) => {
    setStore({ ...store, resData: data })
  }
  const setError = (err) => {
    setStore({ ...store, error: err })
  }
  const setSaveMsg = (msg) => {
    setStore({ ...store, saveMsg: msg });
  }

  const setPassword = (pass) => {
    setStore({ ...store, isAuth: { ...store.isAuth, password: pass } })
  }

  // useEffect(() => {
  //   let timeOutId = "";
  //   const updateContent = (textData) => {
  //     const formData = new FormData();
  //     formData.append("room_id", roomId);
  //     formData.append("content", textData);
  //     // formData.append("last_modified", now());
  //     // getLocalStorageObj("localRoomId", "password") && formData.append("pass", getLocalStorageObj("localRoomId", "password"));
  //     updateRoomContentApi(formData)
  //       .then((res) => {
  //         setSaveMsg("saved.");
  //         setResData({
  //           ...res.data, last_modified: getDateFormat(now())
  //         })
  //       })
  //   }
  //   // debugger
  //   if (roomId.length > 0 && resData.content !== roomContent && !isRoomSecure) {
  //     timeOutId = setTimeout((roomContent) => {
  //       updateContent(roomContent);
  //     }, 1000, roomContent)
  //     return () => {
  //       clearTimeout(timeOutId);
  //     }
  //   }
  // }, [roomContent])
  return (
    <RoomContext.Provider value={{ ...store, ...state, setRoomId, setRoomContent, setResData, setError, setSaveMsg, setPassword, dispatch }}>
      {children}
    </RoomContext.Provider>
  )
}

export default RoomProvider