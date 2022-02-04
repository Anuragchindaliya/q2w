import React, { useState, useRef, useEffect } from 'react'

const Homepage = () => {
    const [roomId, setRoomId] = useState("");
    const [resData, setResData] = useState({ content: "" });
    const [roomContent, setRoomContent] = useState("");
    const [saveMsg, setSaveMsg] = useState("saved.")
    const textareaRef = useRef(null)
    const [isRoomIdChanged, setRoomIdChanged] = useState(false)


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
        setSaveMsg("saving....")
    }

    const handleRoomBlur = (e) => {
        const { value } = e.target;
        if (value.length > 0 && isRoomIdChanged) {
            const formData = new FormData();
            formData.append("room_id", value);
            fetch("http://192.168.1.30/q2wapi/api/createroom", { method: "POST", body: formData }).then((res) => res.json()).then((res) => {
                if (res.status === "success") {
                    setResData({ content: "" });
                    setRoomContent("");
                } else if (res.status === "already") {
                    setResData(res.data)
                    setRoomContent(res.data.content);
                }
                setRoomIdChanged(false)

            })

        }
    }

    function now() {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var sec = d.getSeconds();
        // 2022 - 02 - 03 16: 59: 45
        var output = d.getFullYear() + "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day + " " + hour + ":" + minute + ":" + sec;
        return output;
    }

    

    useEffect(() => {
        let timeOutId = "";
        const updateContent = (textData) => {
            const formData = new FormData();
            formData.append("room_id", roomId);
            formData.append("content", textData);
            formData.append("last_modified", now());
            fetch("http://192.168.1.30/q2wapi/api/updateroom", { method: "POST", body: formData })
                .then((res) => res.json()).then(() => setSaveMsg("saved."))
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

    const getDateFormat = (dateStr) => {
        return new Date(dateStr).toLocaleString()
        // const t = dateStr.split(/[- :]/)
        // let d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
        // return `Last Modified :  ${d.toLocaleTimeString()} ${d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
    console.log(resData, "new Data");
    return (
        <>
            <nav className="navbar navbar-dark bg-dark navbar-fixed-top text-center">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#/">Query-2-Write</a>
                    </div>
                </div>
            </nav>
            <div className='container mt-3'>
                <div className="row mb-2" >
                    <div className="col-12">
                        <input className="form-control" id="room_id" type="text" placeholder="Enter room id" value={roomId} onKeyPress={focusRoomContent} onChange={handleRoomId} onBlur={handleRoomBlur} autoFocus />
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
                    <div className='col-4'> {roomContent.length === 0 ? "No" : roomContent.length} character {saveMsg} </div>
                    <div className='col-6 ms-auto text-end'>{resData.last_modified && getDateFormat(resData["last_modified"])} </div>
                </div>
            </div>
            {/* <footer className="fixed-bottom bg-dark px-3 py-1 text-center">
                <a className="text-white" href="https://www.web2rise.com">Designed By Web2Rise</a>
            </footer> */}
        </>
    )
}

export default Homepage;
