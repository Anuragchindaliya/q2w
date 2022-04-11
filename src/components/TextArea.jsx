import React, { useContext, useEffect, useRef, useState } from 'react'
import { updateRoomContentApi } from '../services';
import { RoomContext } from '../store/RoomProvider';
import ContentInfo from './ContentInfo';

const TextArea = () => {

    const { roomIdSubmit, dispatch, roomId } = useContext(RoomContext);
    const { content } = roomIdSubmit.data;
    const [localRoomContent, setLocalRoomContent] = useState("");
    const [saveMsg, setSaveMsg] = useState("saved.");
    console.log(localRoomContent, content, "text here")
    const handleRoomContent = (e) => {
        setLocalRoomContent(e.target.value);
        dispatch({ type: "ROOM_CONTENT_UPDATE", payload: e.target.value })
        dispatch({ type: "ROOM_INFO_UPDATE", payload: { saveMsg: "typing..." } })
        setSaveMsg("typing...")
        characterSaveMsg();
    }

    const handleUpdatecontent = (newcontent) => {
        dispatch({ type: "ROOM_CONTENT_FETCH", })

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
                dispatch({ type: "ROOM_INFO_UPDATE", payload: { ip, last_modified, saveMsg: "saved." } })
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
        content && setLocalRoomContent(content)
    }, [content]);

    useEffect(() => {
        let timeoutid;
        if (localRoomContent?.length > 0 && localRoomContent !== content)
            timeoutid = setTimeout(() => {
                setSaveMsg("saving...")
                dispatch({ type: "ROOM_INFO_UPDATE", payload: { saveMsg: "saving..." } })
                handleUpdatecontent(localRoomContent)
            }, 1000);
        return () => {
            clearTimeout(timeoutid);
        }
    }, [localRoomContent]);
    return (
        <>
            <div className="row mt-2">
                <div className="col-md-12">
                    {roomIdSubmit.loading ? <div>content is loading</div> :

                        <textarea
                            className="form-control room_content"
                            placeholder="Your content..."
                            value={localRoomContent}
                            onChange={handleRoomContent}

                        />}
                </div>
            </div>
            <ContentInfo />
            {/* <div className='row'>
                <div className='col-md-4 col-5 small'> {roomId.id.length > 0 ? characterSaveMsg() : "Please Enter room id"}  </div>
                <div className='col-md-6 col-5 ms-auto text-end small'>{getDateFormat(roomInfo.last_modified)} </div>
            </div>
            <div className='row'>
                <div className='col-md-4 col-5 small'> {roomInfo.ip ? "IP " + roomInfo.ip : "IP not available"} </div>
                <div className='col-md-6 col-5 ms-auto text-end small'> </div>
            </div> */}


        </>
    )
}

export default TextArea