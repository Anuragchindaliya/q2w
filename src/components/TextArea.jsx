import React, { useContext, useEffect, useRef, useState } from 'react'
import { updateRoomContentApi } from '../services';
import { RoomContext } from '../store/RoomProvider';
import { getLocalStorageObj } from '../utils';
import ContentInfo from './ContentInfo';

const TextArea = () => {

    const { roomIdSubmit, roomContent, dispatch, roomId } = useContext(RoomContext);
    const [isRoomContentChanged, setRoomContentChanged] = useState(false);
    const textAreaRef = useRef(null)


    const handleUpdatecontent = (newcontent) => {
        dispatch({ type: "ROOM_CONTENT_FETCH", })

        const formData = new FormData();
        formData.append("room_id", roomId.id);
        formData.append("content", newcontent);
        // formData.append("last_modified", now());
        getLocalStorageObj("localRoomId", "password") && formData.append("pass", getLocalStorageObj("localRoomId", "password"));
        updateRoomContentApi(formData)
            .then((res) => {

                dispatch({ type: "ROOM_CONTENT_SUCCESS", payload: res.data })
                const { ip, last_modified } = res.data;
                dispatch({ type: "ROOM_INFO_UPDATE", payload: { ip, last_modified, saveMsg: "saved." } })
                setRoomContentChanged(false);
            })
    }


    // const { content } = roomIdSubmit.data;

    const handleRoomContent = (e) => {
        dispatch({ type: "ROOM_CONTENT_UPDATE", payload: e.target.value })
        dispatch({ type: "ROOM_INFO_UPDATE", payload: { saveMsg: "typing..." } })
        setRoomContentChanged(true);
    }

    useEffect(() => {
        let timeoutid;
        console.log("content changed in room")
        if (roomContent.content !== null && textAreaRef.current) {
            textAreaRef.current.focus();
        }
        if (roomId.id && isRoomContentChanged && roomContent.content !== roomIdSubmit.data.content)
            timeoutid = setTimeout(() => {

                dispatch({ type: "ROOM_INFO_UPDATE", payload: { saveMsg: "saving..." } })
                handleUpdatecontent(roomContent.content)
            }, 1000);
        return () => {
            clearTimeout(timeoutid);
        }
    }, [roomContent.content]);
    return (
        <>
            <div className="row mt-2">
                <div className="col-md-12">
                    {roomIdSubmit.loading ? <div>content is loading</div> :
                        roomContent.content !== null &&
                        <textarea
                            className="form-control room_content"
                            placeholder="Your content..."
                            value={roomContent.content}
                            onChange={handleRoomContent}
                            ref={textAreaRef}
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