import React, { useContext, useEffect, useRef, useState } from 'react'
import { updateRoomContentApi } from '../services';
import { RoomContext } from '../store/RoomProvider';
import { getDateFormat } from '../utils';

const TextArea = () => {
    const textareaRef = useRef(null)
    // const { roomContent, dispatch, setRoomContent, saveMsg, setSaveMsg, roomId } = useContext(RoomContext);
    const { roomInfo, roomContent, roomContentSubmit, dispatch, roomId } = useContext(RoomContext);
    const { content } = roomContent;
    const [localRoomContent, setLocalRoomContent] = useState("");
    const [saveMsg, setSaveMsg] = useState("saved.")
        ;

    const handleRoomContent = (e) => {
        setLocalRoomContent(e.target.value);
        setSaveMsg("typing...")
        characterSaveMsg();
    }

    const handleUpdatecontent = (newcontent) => {
        dispatch({ type: "UPDATE_CONTENT_FETCH", })

        const formData = new FormData();
        formData.append("room_id", roomId.id);
        formData.append("content", newcontent);
        // formData.append("last_modified", now());
        // getLocalStorageObj("localRoomId", "password") && formData.append("pass", getLocalStorageObj("localRoomId", "password"));
        updateRoomContentApi(formData)
            .then((res) => {
                setSaveMsg("saved.");
                dispatch({ type: "ROOM_CONTENT_SUCCESS", payload: res.data })
                const { ip, last_modified } = res.data;
                dispatch({ type: "ROOM_INFO_UPDATE", payload: { ip, last_modified } })
            })
    }


    const characterSaveMsg = () => {
        if (localRoomContent) {
            if (localRoomContent.length === 0) {
                return `No character ${saveMsg}`;
            }
            else {
                return `${localRoomContent.length} character ${saveMsg}`;
            }
        } else {
            return `No character ${saveMsg}`;
        }
    }


    useEffect(() => {
        if (content) {
            setLocalRoomContent(content)
        }
    }, [content]);

    useEffect(() => {
        let timeoutid;
        if (localRoomContent.length > 0 && localRoomContent !== content)
            timeoutid = setTimeout(() => {
                setSaveMsg("saving...")
                handleUpdatecontent(localRoomContent)
            }, 1000);
        return () => {
            clearTimeout(timeoutid);
        }
    }, [localRoomContent]);
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    {roomContentSubmit.loading ? <div>content is loading</div> :
                        roomContent.content.length > 0 ?
                            <textarea
                                className="form-control room_content"
                                placeholder="Your content..."
                                value={localRoomContent}
                                onChange={handleRoomContent}
                                ref={textareaRef}
                            /> : "No content"}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-4 col-5 small'> {roomId.id.length > 0 ? characterSaveMsg() : "Please Enter room id"}  </div>
                <div className='col-md-6 col-5 ms-auto text-end small'>{getDateFormat(roomInfo.last_modified)} </div>
            </div>
            <div className='row'>
                <div className='col-md-4 col-5 small'> {roomInfo.ip ? "IP " + roomInfo.ip : "IP not available"} </div>
                <div className='col-md-6 col-5 ms-auto text-end small'> </div>
            </div>


        </>
    )
}

export default TextArea