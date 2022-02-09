import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';


const Homepage = () => {
    let { roomIdPath } = useParams();
    const [roomId, setRoomId] = useState(roomIdPath || localStorage.getItem("localRoomId") || "");
    const [resData, setResData] = useState({ content: "" });
    const [roomContent, setRoomContent] = useState("");
    const [error, setError] = useState("");
    const [saveMsg, setSaveMsg] = useState("saved.")
    const textareaRef = useRef(null)
    const roomIdRef = useRef(null)
    const [isRoomIdChanged, setRoomIdChanged] = useState(true)

    const focusRoomContent = (e) => {
        if (e.key === "Enter")
            textareaRef.current.focus();
    }

    const handleRoomId = (e) => {
        setRoomId(e.target.value);
        setRoomIdChanged(true);
    }

    const handleRoomContent = (e) => {
        setRoomContent(e.target.value);
        roomId.length > 0 && setSaveMsg("saving....")
    }

    const handleRoomBlur = (e) => {
        const { value } = e.target;
        if (value.length > 0 && isRoomIdChanged) {

            const formData = new FormData();
            formData.append("room_id", value);
            fetch("https://q2w.in/q2wapi/api/createroom", { method: "POST", body: formData }).then((res) => res.json()).then((res) => {
                if (res.status === "success") {
                    setResData({ content: "" });
                    setRoomContent("");
                } else if (res.status === "already") {
                    setResData({ ...res.data, last_modified: getDateFormat(res.data.last_modified) })
                    setRoomContent(res.data.content);
                }
                setSaveMsg("saved.");
                setRoomIdChanged(false);
                localStorage.setItem("localRoomId", roomId)
            }).catch(err => setError(err))

        }
    }

    function now() {

        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        return new Date(Date.now() - tzoffset).toISOString().slice(0, 19).replace('T', ' ');
    }

    useEffect(() => {
        let timeOutId = "";
        const updateContent = (textData) => {
            const formData = new FormData();
            formData.append("room_id", roomId);
            formData.append("content", textData);
            formData.append("last_modified", now());
            fetch("https://q2w.in/q2wapi/api/updateroom", { method: "POST", body: formData })
                .then((res) => res.json())
                .then(() => {
                    setSaveMsg("saved.");
                    setResData({
                        ...resData, last_modified: getDateFormat(now())
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
    const characterSaveMsg = () => {

        if (roomContent.length === 0) {
            return `No character ${saveMsg}`;
        }
        else {
            return `${roomContent.length} character ${saveMsg}`;
        }
    }
    return (
        <>
            {
                error ?
                    <div style={{ height: "90vh" }} className="d-flex align-items-center justify-content-center flex-column">
                        <img src='error.png' style={{ width: "300px" }} alt="something went wront" />
                        <h1 className='text-center'>Something went wrong...</h1>
                    </div>
                    :
                    <div className='container mt-3'>
                        <div className="row mb-2" >
                            <div className="col-12">
                                <input className="form-control" id="room_id" type="text" placeholder="Enter room id" value={roomId} onKeyPress={focusRoomContent} onChange={handleRoomId} onBlur={handleRoomBlur} ref={roomIdRef} autoFocus />
                            </div>
                            {/* <div className="col-4">
                                <div className="btn btn-success w-100">Create New</div>
                            </div> */}
                        </div>

                        <textarea
                            className="form-control room_content"
                            placeholder="Your content..."
                            value={roomContent}
                            onChange={handleRoomContent}
                            ref={textareaRef}
                        />
                        <div className='row'>
                            <div className='col-4 small'> {roomId.length > 0 ? characterSaveMsg() : "Please Enter room id"}  </div>
                            <div className='col-6 ms-auto text-end small'>{resData.last_modified} </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Homepage;
