import React from 'react'
import weburl from '../config';
import { now } from '../utils';

const PasswordForm = ({ roomId, passwordRef }) => {
    const roomLogin = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("room_id", roomId);
        formData.append("pass", passwordRef.current.value);
        fetch(`${weburl}/api/login`, { method: "POST", body: formData })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "success") {
                    // setRoomSecure(false);
                    // setSaveMsg("saved.");
                    // setResData({
                    //     ...res.data, last_modified: getDateFormat(now())
                    // })
                    // setRoomContent(res.data.content);
                    localStorage.setItem("localRoomId", JSON.stringify({ id: roomId, password: res.data.pass }))
                } else {

                }
            })
    }
    return (
        <form onSubmit={roomLogin}>
            <h3>Room is secure</h3>
            <div className='row p-2'>
                <input type="password" placeholder='Enter password' className="form-control mb-2 " ref={passwordRef} />
                <button type="submit" className="btn btn-primary">Login</button>
            </div>
        </form>
    )
}

export default PasswordForm