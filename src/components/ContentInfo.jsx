import React, { useContext } from 'react'
import { RoomContext } from '../store/RoomProvider'

const ContentInfo = () => {
    const { roomId, resData, roomContent, saveMsg } = useContext(RoomContext);
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
            <div className='row'>
                <div className='col-md-4 col-5 small'> {roomId.length > 0 ? characterSaveMsg() : "Please Enter room id"}  </div>
                <div className='col-md-6 col-5 ms-auto text-end small'>{resData.last_modified} </div>
            </div>
            <div className='row'>
                <div className='col-md-4 col-5 small'> {resData.ip ? resData.ip : "IP not available"} </div>
                <div className='col-md-6 col-5 ms-auto text-end small'> </div>
            </div>
        </>
    )
}

export default ContentInfo