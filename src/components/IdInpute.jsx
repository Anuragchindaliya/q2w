import React, { useContext, useEffect, useState } from 'react'
import { checkAuthApi, createRoomApi, roomLoginApi } from '../services'
import { RoomContext } from '../store/RoomProvider'
import { roomIdSubmitTypes } from '../types'
import { FaUsers, FaLock } from "react-icons/fa"
import CredentialModal from './CredentialModal'
import { getLocalStorageObj } from '../utils'
const IdInpute = () => {
  const [isModalShow, setModalShow] = useState(false);
  const { roomId, roomPassword, dispatch } = useContext(RoomContext)
  const [isRoomIdChanged, setRoomIdChanged] = useState(false);
  const initialTab = (getLocalStorageObj("localRoomId", "password") && "secure") || "public";
  const [tab, setTab] = useState(initialTab)
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("")
  const [isRoomSecure, setRoomSecure] = useState(false);
  const { FETCH, SUCCESS, ERROR, RESET } = roomIdSubmitTypes;

  // const [isRoomIdChanged, setRoomIdChanged] = useState(false);
  // const [localRoomId, setLocalRoomId] = useState(getLocalStorageObj("localRoomId", "id"))
  // console.log(localRoomId,"local room id");

  const setDataInStore = (res) => {
    dispatch({ type: SUCCESS, payload: res.data })
    const { content, ip, last_modified } = res.data;
    // for content character length in contentinfo
    dispatch({ type: "ROOM_CONTENT_UPDATE", payload: content })
    dispatch({ type: "ROOM_INFO_UPDATE", payload: { ip, last_modified, saveMsg: "saved." } })
    setErrorMsg("");
  }
  // const hitApi = (formData, apiType) => {
  //   dispatch({ type: FETCH })
  //   return apiType(formData).then((res) => {
  //     if (res.status === "success") {
  //       setDataInStore()
  //     } else {
  //       console.log("Error in login");
  //     }
  //   })
  // }
  const handleLoginRoom = () => {
    const formData = new FormData();
    formData.append("room_id", roomId.id);
    formData.append("pass", roomPassword.password);
    // hitApi("secure", roomLoginApi)
    roomLoginApi(formData).then((res) => {
      if (res.status === "success") {
        setDataInStore(res, "secure")
        const localStorageData = {
          id: roomId.id,
          password: res.data.pass
        }
        localStorage.setItem("localRoomId", JSON.stringify(localStorageData))
        setRoomSecure(true);
      } else {
        console.log("Error in login");
      }
    })
  }

  const handleCreateRoom = () => {
    localStorage.setItem("localRoomId", JSON.stringify({ id: roomId.id }))

    const formData = new FormData();
    formData.append("room_id", roomId.id);
    createRoomApi(formData).then((res) => {
      if (res.status === "success") {
        const { ip, last_modified } = res.data;
        dispatch({ type: "ROOM_ID_SUCCESS", payload: res.data })
        // dispatch({ type: "ROOM_CONTENT_UPDATE", payload: res.data })
        dispatch({ type: "ROOM_INFO_UPDATE", payload: { ip, last_modified, saveMsg: "saved." } })
        setSuccessMsg("Room Created Successfully")
        setTimeout(() => setSuccessMsg(""), 3000)
        // setDataInStore(res);
      } else if (res.status === "already") {

        setDataInStore(res, "public")
        setRoomSecure(false)

      } else if (res.status === "secure") {
        dispatch({ type: "ROOM_CONTENT_RESET" })
        // dispatch({ type: "ROOM_ID_RESET" })
        dispatch({ type: "ROOM_INFO_RESET" })
        setErrorMsg("This room is secure")
      } else if (res.status === "failure") {
      }
    }).catch(err => {
      dispatch({ type: ERROR, payload: err })
    })
    setRoomIdChanged(false)
  }
  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (tab === "public") {
      if (!roomId.id) {
        setErrorMsg("Please Enter roomId");
      }
      isRoomIdChanged && handleCreateRoom();
    } else {
      if (!roomId.id || !roomId.password) {
        setErrorMsg("Please enter roomId and password");
      }
      handleLoginRoom()
    }
  }
  const handleAuth = () => {
    const formData = new FormData();
    formData.append("room_id", roomId.id);
    formData.append("pass", getLocalStorageObj("localRoomId", "password"));
    checkAuthApi(formData).then(res => {
      if (res.status === "success") {
        setDataInStore(res, "secure")
        setRoomSecure(true);
        // const localStorageData = {
        //   id: roomId.id,
        //   password: res.data.pass
        // }
        // localStorage.setItem("localRoomId", JSON.stringify(localStorageData))
      } else {
        console.log("Error in login");
      }
    });
  }
  useEffect(() => {
    if (tab === "public") {
      roomId.id && handleCreateRoom();
    } else {
      handleAuth();
    }
  }, [])

  const handleInputFields = (e) => {
    //for roomid and password change
    setRoomIdChanged(true)
    dispatch({ type: `${e.target.name}_CHANGE`, payload: e.target.value })
  }
  const handleTab = (roomType) => {
    dispatch({ type: "ROOM_ID_RESET" });
    dispatch({ type: "ROOM_PASSWORD_RESET" });
    dispatch({ type: "ROOM_CONTENT_RESET" })
    dispatch({ type: "ROOM_INFO_RESET" })
    setTab(roomType)
  }
  // console.log(roomPassword.password, roomId.id, "currentvalue")
  return (
    <>
      <CredentialModal show={isModalShow} onHide={() => setModalShow(false)} />
      <div className="row mb-2">
        <div className='col-md-9 col-6'>
          <div data-tip="Public" className={`btn ${tab === "public" ? "btn-dark shadow" : "btn-light"} me-1 `}>
            <FaUsers onClick={() => handleTab("public")} />
          </div>
          <div data-tip="Secure" onClick={() => handleTab("secure")} className={`btn ${tab === "secure" ? "btn-dark shadow" : "btn-light"} me-1 `}>
            <FaLock />
          </div>
          {successMsg &&
            <div className='btn btn-success'>
              {successMsg}
            </div>
          }

        </div>
        {!isRoomSecure && <div className='col-md-3 col-6 btn text-end' onClick={() => setModalShow(true)}>Secure This Room</div>}
      </div>
      <div className='row'>
        <form className="col-12" onSubmit={handleRoomSubmit}>
          <div className="input-group">
            <input className="form-control" id="room_id" type="text" name="ROOM_ID" placeholder="Enter room id" value={roomId.id} onChange={handleInputFields} autoFocus aria-label="Enter room ID" aria-describedby="basic-addon2" />

            {tab === "secure" && <input className="form-control" id="room_password" type="password" name="ROOM_PASSWORD" placeholder="Enter room password" value={roomId.password} onChange={handleInputFields} aria-label="Enter password" aria-describedby="basic login password" />}

            <button type="submit" className="input-group-text btn-danger" id="basic-addon2">
              {/* <svg width={"20px"} fill="#fff" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.88 121.43" style={{ enableBackground: 'new 0 0 122.88 121.43' }} xmlSpace="preserve"><g><path d="M112.67,62.75L6.45,115.3l27.99-52.55H112.67L112.67,62.75z M121.62,59L2.78,0.2C1.82-0.27,0.67,0.12,0.2,1.08 C-0.09,1.66-0.05,2.3,0.23,2.83l-0.01,0l30.88,57.98L0.22,118.79l2.56,2.64L121.8,62.55l0-0.01c0.64-0.31,1.08-0.97,1.08-1.72 c0,0,0,0,0,0C122.88,60,122.38,59.28,121.62,59L121.62,59L121.62,59z" /></g></svg> */}

              <svg width={"20px"} fill="#fff" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 122.86 121.64"><title>Get Room</title><path d="M121.62,59,2.78.2A1.92,1.92,0,0,0,.2,1.08a1.89,1.89,0,0,0,0,1.76h0l30.87,58L.23,118.8h0a1.89,1.89,0,0,0,0,1.76,1.92,1.92,0,0,0,2.58.88l118.84-58.8a2,2,0,0,0,0-3.64Z" /></svg>
            </button>
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