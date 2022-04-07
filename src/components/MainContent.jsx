import React, { useState, useRef, useEffect, useContext } from 'react';
import Q2wTabs from './Q2wTabs';
import { getDateFormat, getLocalStorageObj, now } from '../utils';
import { Offcanvas } from 'react-bootstrap';
import { createRoomApi, roomLoginApi, updateRoomContentApi } from '../services';
import { RoomContext } from '../store/RoomProvider';
import REGEX from "../constants";
import TextArea from './TextArea';
import ContentInfo from './ContentInfo';
import IdInpute from './IdInpute';

const MainContent = ({ setModalShow, show, handleClose }) => {

    const { dispatch, roomId, setRoomId, roomContent, setRoomContent, resData, setResData, error, setError, saveMsg, setSaveMsg } = useContext(RoomContext);
    const [state, setState] = useState({ urls: [], numbers: [] })
    // const [resData, setResData] = useState({ content: "" });
    // const [roomContent, setRoomContent] = useState("");
    // const [error, setError] = useState("");
    // const [saveMsg, setSaveMsg] = useState("saved.")

    // const textareaRef = useRef(null)

    const roomIdRef = useRef(null)
    const passwordRef = useRef(null);
    const [isRoomIdChanged, setRoomIdChanged] = useState(true);
    const [isRoomSecure, setRoomSecure] = useState((getLocalStorageObj("localRoomId", "password") && true) || false);
    const [passwordMsg, setPasswordMsg] = useState("");


    const characterSaveMsg = () => {

        if (roomContent.length === 0) {
            return `No character ${saveMsg}`;
        }
        else {
            return `${roomContent.length} character ${saveMsg}`;
        }
    }
    const handleRoomContent = (e) => {
        setRoomContent(e.target.value);
        roomId.length > 0 && setSaveMsg("saving....")
    }

    const focusRoomContent = (e) => {
        // if (e.key === "Enter" && !isRoomSecure)
        //     textareaRef.current?.focus();
    }

    const handleRoomId = (e) => {
        dispatch({ type: "ROOM_ID_CHANGE", payload: e.target.value })
        setRoomId(e.target.value);
        setRoomIdChanged(true);
    }


    const handleRoomBlur = (e) => {
        // e.preventDefault();
        const { value } = e.target;

        // handleCreateRoomApi(value)
    }
    const handleCreateRoomApi = (roomIdValue) => {
        localStorage.removeItem("localRoomId")
        if (roomIdValue.length > 0 && isRoomIdChanged) {

            const formData = new FormData();
            formData.append("room_id", roomIdValue);
            isRoomSecure && formData.append("pass", getLocalStorageObj("localRoomId", "password"));
            createRoomApi(formData).then((res) => {
                if (res.status === "success") {
                    setResData({ content: "" });
                    setRoomContent("");
                    setRoomSecure(false);
                } else if (res.status === "already") {
                    // debugger
                    setResData((store) => ({ ...store.data, last_modified: getDateFormat(res.data.last_modified) }))
                    let urls = res.data.content.match(REGEX.URL)
                    urls = urls && urls.map(url => {
                        if (url.includes("http")) {
                            return url;
                        } else {
                            return `http://${url}`;
                        }
                    })

                    let numbers = res.data.content.match(/(\+?[0-9]+)?([-| ])?[0-9]{10}/gm);
                    // console.log(urls, "urls", numbers, "numbers");
                    setState({ ...state, urls: urls !== null ? urls : [], numbers: numbers !== null ? numbers : [] });
                    setRoomContent(res.data.content);


                    if (isRoomSecure) {
                        localStorage.setItem("localRoomId", JSON.stringify({ id: roomId, password: res.data.pass }));
                    } else {
                        localStorage.setItem("localRoomId", JSON.stringify({ id: roomId }))
                    }
                    setRoomSecure(false);
                    // textareaRef.current.focus();
                } else if (res.status === "secure") {
                    setRoomSecure(true);
                    setRoomContent("");
                    setResData({ content: "" });
                    localStorage.setItem("localRoomId", JSON.stringify({ id: roomId }))
                } else if (res.status === "failure") {

                }

                setSaveMsg("saved.");
                setRoomIdChanged(false);
                // console.log(roomId);


            }).catch(err => {
                // console.log(err)
                setError(err)
            })

        }
        // console.log(roomId, "roomcontent", roomContent, "res", resData, "after request");
    }

    useEffect(() => {
        let timeOutId = "";
        const updateContent = (textData) => {
            const formData = new FormData();
            formData.append("room_id", roomId);
            formData.append("content", textData);
            // formData.append("last_modified", now());
            // getLocalStorageObj("localRoomId", "password") && formData.append("pass", getLocalStorageObj("localRoomId", "password"));
            updateRoomContentApi(formData)
                .then((res) => {
                    setSaveMsg("saved.");
                    setResData({
                        ...res.data, last_modified: getDateFormat(now())
                    })
                })
        }
        // debugger
        if (roomId.length > 0 && resData.content !== roomContent && !isRoomSecure) {
            timeOutId = setTimeout((roomContent) => {
                updateContent(roomContent);
            }, 1000, roomContent)
            return () => {
                clearTimeout(timeOutId);
            }
        }
    }, [roomContent])

    useEffect(() => {
        // if (getLocalStorageObj("localRoomId", "password")) {
        //     setRoomSecure(true);
        //     textareaRef.current.focus();
        // }


        // textareaRef.current.focus()

        let localId
        if ((localId = getLocalStorageObj("localRoomId", "id"))) {
            // console.log(localId, "from local");
            // handleCreateRoomApi(localId)
        }
        // handleCreateRoomApi()
        // localStorage.getItem("localRoomId") && passwordRef.current.focus();

    }, [])



    const roomLogin = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("room_id", roomId);
        formData.append("pass", passwordRef.current.value);
        roomLoginApi(formData).then((res) => {
            if (res.status === "success") {
                setRoomSecure(false);
                setSaveMsg("saved.");
                setResData({
                    ...res.data, last_modified: getDateFormat(now())
                })
                setRoomContent(res.data.content);
                localStorage.setItem("localRoomId", JSON.stringify({ id: roomId, password: res.data.pass }))
                setPasswordMsg("")
            } else {
                setPasswordMsg("Incorrect password")
            }
        })
    }
    // const handleRoomSubmit = (e) => {
    //     e.preventDefault();
    //     console.log("submit")
    //     handleCreateRoomApi(e.target.roomId.value)
    // }
    const handleRoomSubmit = (e) => {
        e.preventDefault();
        console.log("submit data");
        dispatch({ type: "ROOM_ID_FETCH" })
        const roomIdValue = e.target.roomId.value
        if (roomIdValue.length > 0 && isRoomIdChanged) {
            // debugger
            const formData = new FormData();
            formData.append("room_id", roomIdValue);
            isRoomSecure && formData.append("pass", getLocalStorageObj("localRoomId", "password"));
            createRoomApi(formData).then((res) => {
                if (res.status === "success") {
                    setResData({ content: "" });
                    setRoomContent("");
                    setRoomSecure(false);
                } else if (res.status === "already") {

                    dispatch({ type: "ROOM_ID_SUCCESS", payload: res.data })
                    setResData((store) => ({ ...store.data, last_modified: getDateFormat(res.data.last_modified) }))
                    let urls = res.data.content.match(REGEX.URL)
                    urls = urls && urls.map(url => {
                        if (url.includes("http")) {
                            return url;
                        } else {
                            return `http://${url}`;
                        }
                    })

                    let numbers = res.data.content.match(/(\+?[0-9]+)?([-| ])?[0-9]{10}/gm);
                    // console.log(urls, "urls", numbers, "numbers");
                    setState({ ...state, urls: urls !== null ? urls : [], numbers: numbers !== null ? numbers : [] });
                    setRoomContent(res.data.content);


                    if (isRoomSecure) {
                        localStorage.setItem("localRoomId", JSON.stringify({ id: roomId, password: res.data.pass }));
                    } else {
                        localStorage.setItem("localRoomId", JSON.stringify({ id: roomId }))
                    }
                    setRoomSecure(false);
                    // textareaRef.current.focus();
                } else if (res.status === "secure") {
                    setRoomSecure(true);
                    setRoomContent("");
                    setResData({ content: "" });
                    localStorage.setItem("localRoomId", JSON.stringify({ id: roomId }))
                } else if (res.status === "failure") {
                    dispatch({ type: "ROOM_ID_ERROR", payload: res.data })
                }

                setSaveMsg("saved.");
                setRoomIdChanged(false);
                console.log(roomId);


            }).catch(err => {
                console.log(err)
                setError(err)
            })

        }

    }
    // console.log(resData, isRoomSecure, "data");
    // console.log(isRoomIdChanged, roomIdRef, textareaRef, saveMsg, error, roomContent, resData, roomId, "rendering");
    return (
        <>
            {
                error ?
                    <div style={{ height: "90vh" }} className="d-flex align-items-center justify-content-center flex-column">
                        <img src='assets/img/error.png' style={{ width: "300px" }} alt="something went wront" />
                        <h1 className='text-center'>Something went wrong...</h1>
                    </div>
                    :
                    <div className='container mt-3 main-section' style={{ height: "calc(100vh - 75px)" }}>
                        <div className="row mb-2" >
                            <div className="col-lg-8">
                                <div className="row">
                                    {/* <form className={`${isRoomSecure ? "col-md-11 col-10" : "col-12"}`} onSubmit={handleRoomSubmit}>
                                        <input className="form-control mb-2" id="room_id" type="text" name="roomId" placeholder="Enter room id" value={roomId} onKeyPress={focusRoomContent} onChange={handleRoomId} onBlur={handleRoomBlur} ref={roomIdRef} autoFocus />
                                    </form> */}
                                    <IdInpute />
                                    {/* <form className="col-md-11 col-10" onSubmit={handleRoomSubmit}>
                                        <input className="form-control mb-2" id="room_id" type="text" name="roomId" placeholder="Enter room id" value={roomId.id} onKeyPress={focusRoomContent} onChange={handleRoomId} ref={roomIdRef} autoFocus />
                                        <button type='submit' className='btn btn-danger'>
                                            Enter
                                        </button>
                                    </form> */}
                                    {/* <div className="col-md-1 col-2">
                                        <div className='btn btn-danger' onClick={() => setModalShow(true)}>
                                            Enter
                                        </div>

                                    </div> */}
                                    {isRoomSecure && <div className="col-md-1 col-2">
                                        <div className='btn btn-danger' onClick={() => setModalShow(true)}>
                                            <i className='fa fa-lock'></i>
                                        </div>

                                    </div>}

                                </div>
                                <TextArea />

                                {/* <div className="row">
                                    <div className="col-md-12">
                                        {isRoomSecure ? <form onSubmit={roomLogin}>
                                            <h3>Room is secure {passwordMsg && <span className='text-danger'>{passwordMsg}</span>}</h3>
                                            <div className='row p-2'>
                                                <input type="password" placeholder='Enter password' className="form-control mb-2 " ref={passwordRef} />
                                                <button type="submit" className="btn btn-primary">Login</button>
                                            </div>
                                        </form> : <TextArea /> 
                                        }
                                    </div>
                                </div> */}
                                {/* <div className='row'>
                                    <div className='col-md-4 col-5 small'> {roomId.length > 0 ? characterSaveMsg() : "Please Enter room id"}  </div>
                                    <div className='col-md-6 col-5 ms-auto text-end small'>{resData.last_modified} </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4 col-5 small'> {resData.ip ? resData.ip : "IP not available"} </div>
                                    <div className='col-md-6 col-5 ms-auto text-end small'> </div>
                                </div> */}
                                {/* <ContentInfo /> */}
                            </div>
                            <div className="col-md-4 q2wtabs ">
                                <Q2wTabs state={state} />
                            </div>

                            <Offcanvas show={show} onHide={handleClose} placement="end">
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Q2wTabs state={state} />
                                </Offcanvas.Body>
                            </Offcanvas>
                        </div>

                    </div>


            }
        </>
    )
}

export default MainContent;
