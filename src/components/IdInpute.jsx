import React, { useContext, useEffect, useState } from 'react'
import { createRoomApi } from '../services'
import { RoomContext } from '../store/RoomProvider'
import { roomIdSubmitTypes } from '../types'


const IdInpute = () => {
  const { roomId, dispatch } = useContext(RoomContext)
  const [errorMsg, setErrorMsg] = useState("");
  
  // const [isRoomIdChanged, setRoomIdChanged] = useState(false);
  // const [localRoomId, setLocalRoomId] = useState(getLocalStorageObj("localRoomId", "id"))
  // console.log(localRoomId,"local room id");
  const { FETCH, SUCCESS, ERROR, RESET } = roomIdSubmitTypes;
  const handleCreateRoom = () => {
    dispatch({ type: FETCH })
    if (roomId.id.length > 0) {
      const formData = new FormData();
      formData.append("room_id", roomId.id);
      createRoomApi(formData).then((res) => {
        if (res.status === "success") {
        } else if (res.status === "already") {
          dispatch({ type: SUCCESS, payload: res.data })
          const { content, ip, last_modified } = res.data;
          dispatch({ type: "ROOM_CONTENT_UPDATE", payload: content })
          dispatch({ type: "ROOM_INFO_UPDATE", payload: { ip, last_modified } })

        } else if (res.status === "secure") {
        } else if (res.status === "failure") {
        }
      }).catch(err => {
        dispatch({ type: ERROR, payload: err })
      })
    }
  }
  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (roomId.id) {
      localStorage.setItem("localRoomId", JSON.stringify({ id: roomId.id }))
      handleCreateRoom();
    } else {
      setErrorMsg("Please Enter roomId");
    }
  }
  useEffect(() => {
    handleCreateRoom();
  }, [])
  // const handleRoomSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("submit data");
  //   dispatch({ type: "ROOM_ID_FETCH" })
  //   const roomIdValue = e.target.roomId.value
  //   if (roomIdValue.length > 0 && isRoomIdChanged) {
  //     // debugger
  //     const formData = new FormData();
  //     formData.append("room_id", roomIdValue);
  //     isRoomSecure && formData.append("pass", getLocalStorageObj("localRoomId", "password"));
  //     createRoomApi(formData).then((res) => {
  //       if (res.status === "success") {
  //         setResData({ content: "" });
  //         setRoomContent("");
  //         setRoomSecure(false);
  //       } else if (res.status === "already") {
  //         // debugger
  //         dispatch({ type: "ROOM_ID_SUCCESS", payload: res.data })
  //         setResData((store) => ({ ...store.data, last_modified: getDateFormat(res.data.last_modified) }))
  //         let urls = res.data.content.match(REGEX.URL)
  //         urls = urls && urls.map(url => {
  //           if (url.includes("http")) {
  //             return url;
  //           } else {
  //             return `http://${url}`;
  //           }
  //         })

  //         let numbers = res.data.content.match(/(\+?[0-9]+)?([-| ])?[0-9]{10}/gm);
  //         // console.log(urls, "urls", numbers, "numbers");
  //         setState({ ...state, urls: urls !== null ? urls : [], numbers: numbers !== null ? numbers : [] });
  //         setRoomContent(res.data.content);


  //         if (isRoomSecure) {
  //           localStorage.setItem("localRoomId", JSON.stringify({ id: roomId, password: res.data.pass }));
  //         } else {
  //           localStorage.setItem("localRoomId", JSON.stringify({ id: roomId }))
  //         }
  //         setRoomSecure(false);
  //         // textareaRef.current.focus();
  //       } else if (res.status === "secure") {
  //         setRoomSecure(true);
  //         setRoomContent("");
  //         setResData({ content: "" });
  //         localStorage.setItem("localRoomId", JSON.stringify({ id: roomId }))
  //       } else if (res.status === "failure") {
  //         dispatch({ type: "ROOM_ID_ERROR", payload: res.data })
  //       }

  //       setSaveMsg("saved.");
  //       setRoomIdChanged(false);
  //       console.log(roomId);


  //     }).catch(err => {
  //       console.log(err)
  //       setError(err)
  //     })

  //   }

  // }
  const handleRoomId = (e) => {
    dispatch({ type: "ROOM_ID_CHANGE", payload: e.target.value })
    // setRoomIdChanged(true);
    // setRoomIdChanged(true);
  }
  return (
    <form className='row' onSubmit={handleRoomSubmit}>
      <div className="col-10">
        <input className="form-control mb-2" id="room_id" type="text" name="roomId" placeholder="Enter room id" value={roomId.id} onChange={handleRoomId} autoFocus />
      </div>
      <div className='col-2'>
        <button type='submit' className='btn btn-danger '>
          Enter
        </button>
      </div>
      {errorMsg && errorMsg}
    </form>
  )
}

export default IdInpute