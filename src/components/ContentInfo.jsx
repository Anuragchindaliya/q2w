import React, { useContext } from 'react'
import { RoomContext } from '../store/RoomProvider'
import { getDateFormat } from '../utils';

const ContentInfo = () => {
    const { roomId, roomInfo, roomContent, saveMsg } = useContext(RoomContext);
    console.log(roomInfo, "from info")
    const characterSaveMsg = () => {
        if (roomContent.length === 0) {
            return `No character ${roomInfo.saveMsg}`;
        }
        else {
            return `${roomContent.content.length} character ${roomInfo.saveMsg}`;
        }
    }

    return (
        <>
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

export default ContentInfo