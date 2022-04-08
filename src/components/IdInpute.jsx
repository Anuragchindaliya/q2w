import React, { useContext, useEffect, useState } from 'react'
import { createRoomApi, roomLoginApi } from '../services'
import { RoomContext } from '../store/RoomProvider'
import { roomIdSubmitTypes } from '../types'
import { FaUsers, FaLock } from "react-icons/fa"
import CredentialModal from './CredentialModal'
const IdInpute = () => {
  const [isModalShow, setModalShow] = useState(false);
  const { roomId, roomPassword, dispatch } = useContext(RoomContext)
  const [tab, setTab] = useState("public")
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
      if (tab === "public") {
        createRoomApi(formData).then((res) => {
          if (res.status === "success") {
          } else if (res.status === "already") {
            dispatch({ type: SUCCESS, payload: res.data })
            const { content, ip, last_modified } = res.data;
            dispatch({ type: "ROOM_CONTENT_UPDATE", payload: content })
            dispatch({ type: "ROOM_INFO_UPDATE", payload: { ip, last_modified } })

          } else if (res.status === "secure") {
            setErrorMsg("this room is secure")
          } else if (res.status === "failure") {
          }
        }).catch(err => {
          dispatch({ type: ERROR, payload: err })
        })
      } else {
        //secure
        formData.append("pass", roomPassword.password);
        roomLoginApi(formData).then((res) => {
          if (res.status === "success") {
            dispatch({ type: SUCCESS, payload: res.data })
            const { content, ip, last_modified } = res.data;
            dispatch({ type: "ROOM_CONTENT_UPDATE", payload: content })
            dispatch({ type: "ROOM_INFO_UPDATE", payload: { ip, last_modified } })
            setErrorMsg("")
          } else {
            console.log("Error in login");
          }
        })
      }
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
  const handleFields = (e) => {
    dispatch({ type: `${e.target.name}_CHANGE`, payload: e.target.value })
  }
  console.log(roomPassword.password, roomId.id, "currentvalue")
  return (
    <>
      <CredentialModal show={isModalShow} onHide={() => setModalShow(false)} />
      <div className="row mb-2">
        <div className='col-md-9 col-6'>
          <div data-tip="Public" className='btn btn-dark me-1 '>
            <FaUsers onClick={() => setTab("public")} />
          </div>
          <div data-tip="Secure" onClick={() => setTab("secure")} className='btn btn-dark me-1'>
            <FaLock />
          </div>

        </div>
        <div className='col-md-3 col-6 btn text-end' onClick={() => setModalShow(true)}>Secure This Room</div>
      </div>
      <div className='row'>
        <form className="col-12" onSubmit={handleRoomSubmit}>
          <div className="input-group">
            <input className="form-control" id="room_id" type="text" name="ROOM_ID" placeholder="Enter room id" value={roomId.id} onChange={handleFields} autoFocus aria-label="Enter room ID" aria-describedby="basic-addon2" />

            {tab === "secure" && <input className="form-control" id="room_password" type="password" name="ROOM_PASSWORD" placeholder="Enter room password" value={roomId.password} onChange={handleFields} autoFocus aria-label="Enter password" aria-describedby="basic login password" />}

            <button type="submit" className="input-group-text btn-danger" id="basic-addon2">Enter</button>
          </div>
        </form>

      </div>
      <div className="row">
        <div className="col-12">{errorMsg && <div className='text-danger'>{errorMsg}</div>}</div>
      </div>
    </>
  )
}

export default IdInpute