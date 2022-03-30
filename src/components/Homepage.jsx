import React, { useEffect, useState } from 'react'
import CredentialModal from './CredentialModal'
import MainContent from './MainContent'
import { useParams } from 'react-router-dom';
import { getLocalStorageObj } from '../utils';





const Homepage = ({ show, handleClose }) => {
    let { roomIdPath } = useParams();
    // const initialRoomId = localStorage.getItem("localRoomId") && localStorage.getItem("localRoomId")
    // console.log(initialRoomId, "main compononet");
    const [roomId, setRoomId] = useState(roomIdPath || getLocalStorageObj("localRoomId", "id") || "");
    const [modalShow, setModalShow] = React.useState(false);

    // useEffect(() => {
    //     if (getLocalStorageObj("localRoomId", "id")) {
    //         setRoomId(getLocalStorageObj("localRoomId", "id"))
    //     }
    // }, [])

    return (
        <>
            <CredentialModal show={modalShow} onHide={() => setModalShow(false)} roomId={roomId} />
            <MainContent roomId={roomId} setRoomId={setRoomId} setModalShow={setModalShow} show={show} handleClose={handleClose} />
        </>
    )
}

export default Homepage