import React, { useEffect, useState } from 'react'
import CredentialModal from './CredentialModal'
import MainContent from './MainContent'
import { useParams } from 'react-router-dom';
import { getLocalStorageObj } from '../utils';
import RoomProvider from '../store/RoomProvider';



const Homepage = ({ show, handleClose }) => {
    // const initialRoomId = localStorage.getItem("localRoomId") && localStorage.getItem("localRoomId")
    // console.log(initialRoomId, "main compononet");
    const [modalShow, setModalShow] = useState(false);
    // useEffect(() => {
    //     if (getLocalStorageObj("localRoomId", "id")) {
    //         setRoomId(getLocalStorageObj("localRoomId", "id"))
    //     }
    // }, [])

    return (
        <RoomProvider>
            <CredentialModal show={modalShow} onHide={() => setModalShow(false)} />
            <MainContent setModalShow={setModalShow} show={show} handleClose={handleClose} />
        </RoomProvider>
    )
}

export default Homepage