import React, { useState } from 'react'
import CredentialModal from './CredentialModal'
import MainContent from './MainContent'
import { useParams } from 'react-router-dom';

const Homepage = ({ show, handleClose }) => {
    let { roomIdPath } = useParams();
    const [roomId, setRoomId] = useState(roomIdPath || localStorage.getItem("localRoomId") || "");
    const [modalShow, setModalShow] = React.useState(false);
    
    return (
        <>
            <CredentialModal show={modalShow} onHide={() => setModalShow(false)} roomId={roomId} />

            <MainContent roomId={roomId} setRoomId={setRoomId} setModalShow={setModalShow} show={show} handleClose={handleClose} />
        </>
    )
}

export default Homepage