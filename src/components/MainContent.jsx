import React, { useState, useRef, useEffect } from 'react';
import Q2wTabs from './Q2wTabs';
import { now } from '../utils';
import { Offcanvas } from 'react-bootstrap';
import weburl from '../config';

const MainContent = ({ roomId, setRoomId, setModalShow, show, handleClose }) => {

    const [state, setState] = useState({ urls: [], numbers: [] })

    const [resData, setResData] = useState({ content: "" });
    const [roomContent, setRoomContent] = useState("");
    const [error, setError] = useState("");
    const [saveMsg, setSaveMsg] = useState("saved.")

    const textareaRef = useRef(null)
    const roomIdRef = useRef(null)
    const [isRoomIdChanged, setRoomIdChanged] = useState(true)

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
        if (e.key === "Enter")
            textareaRef.current.focus();
    }

    const handleRoomId = (e) => {
        setRoomId(e.target.value);
        setRoomIdChanged(true);
    }


    const handleRoomBlur = (e) => {
        const { value } = e.target;
        if (value.length > 0 && isRoomIdChanged) {

            const formData = new FormData();
            formData.append("room_id", value);
            fetch(`${weburl}/api/createroom`, { method: "POST", body: formData }).then((res) => res.json()).then((res) => {
                if (res.status === "success") {
                    setResData({ content: "" });
                    setRoomContent("");
                } else if (res.status === "already") {
                    setResData({ ...res.data, last_modified: getDateFormat(res.data.last_modified) })
                    let urls = res.data.content.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%+.~#?&//=_]*)/gm)
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
                }
                setSaveMsg("saved.");
                setRoomIdChanged(false);
                localStorage.setItem("localRoomId", roomId)
            }).catch(err => {
                console.log(err)
                setError(err)
            })

        }
    }


    useEffect(() => {
        let timeOutId = "";
        const updateContent = (textData) => {
            const formData = new FormData();
            formData.append("room_id", roomId);
            formData.append("content", textData);
            formData.append("last_modified", now());
            fetch(`${weburl}/api/updateroom`, { method: "POST", body: formData })
                .then((res) => res.json())
                .then((res) => {
                    setSaveMsg("saved.");
                    setResData({
                         ...res.data, last_modified: getDateFormat(now())
                    })
                })
        }
        if (roomId.length > 0 && resData.content !== roomContent) {
            timeOutId = setTimeout((roomContent) => {
                updateContent(roomContent);
            }, 1000, roomContent)
            return () => {
                clearTimeout(timeOutId);
            }
        }
    }, [roomContent])

    useEffect(() => {
        localStorage.getItem("localRoomId") && textareaRef.current.focus();
    }, [])

    const getDateFormat = (dateStr) => {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
        return `Last Modified - ${new Date(dateStr).toLocaleString("en-US", options)}`;
    }

    console.log(resData, "data");
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
                                    <div className="col-md-11 col-10">
                                        <input className="form-control mb-2" id="room_id" type="text" placeholder="Enter room id" value={roomId} onKeyPress={focusRoomContent} onChange={handleRoomId} onBlur={handleRoomBlur} ref={roomIdRef} autoFocus />
                                    </div>
                                    <div className="col-md-1 col-2">
                                        <div className='btn btn-danger' onClick={() => setModalShow(true)}>
                                            <i className='fa fa-lock'></i>
                                        </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <textarea
                                            className="form-control room_content"
                                            placeholder="Your content..."
                                            value={roomContent}
                                            onChange={handleRoomContent}
                                            ref={textareaRef}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4 col-5 small'> {roomId.length > 0 ? characterSaveMsg() : "Please Enter room id"}  </div>
                                    <div className='col-md-6 col-5 ms-auto text-end small'>{resData.last_modified} </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4 col-5 small'> {resData.ip ? resData.ip : "IP not available"} </div>
                                    <div className='col-md-6 col-5 ms-auto text-end small'> </div>
                                </div>
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