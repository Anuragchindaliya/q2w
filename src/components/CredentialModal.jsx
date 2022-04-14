import React, { useContext, useState } from 'react'
import { now } from '../utils'
import { Modal, Button, Form } from 'react-bootstrap'
import { RoomContext } from '../store/RoomProvider'
import { setPasswordApi } from '../services'

const CredentialModal = ({ show, onHide, }) => {
    // const [password, setPassword] = useState("");
    const { roomId, isAuth, dispatch } = useContext(RoomContext);
    const [state, setSate] = useState({ password: "", email: "" })
    const { password, email } = state;
    const createPassword = () => {
        const formData = new FormData();
        formData.append("room_id", roomId.id);
        formData.append("pass", password);
        formData.append("last_modified", now());
        setPasswordApi(formData).then((result) => {
            // console.log(result, "updatepassword")
            onHide();
            // setResData({
            //     ...resData, last_modified: getDateFormat(now())
            // })
        })
    }
    const handleState = (e) => {
        setSate((state) => ({ ...state, [e.target.name]: e.target.value }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("room_id", roomId.id);
        formData.append("pass", password);
        if (email && email.length !== 0) {
            formData.append("email", email);
        }
        setPasswordApi(formData).then(
            (res) => {
                if (res.status === "success") {
                    console.log("room is secure");
                    const { room_id, pass } = res.data;
                    localStorage.setItem("localRoomId", JSON.stringify({ id: room_id, password: pass }))
                    dispatch({ type: "ROOM_INFO_UPDATE", payload: res.data })
                } else if (res.status === "failure") {
                    console.log(res.msg)
                }
            }
        )
        e.target.reset();
        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Secure Room
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <h3 className='text-center'>Private room Comming soon..</h3> */}

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Password" value={password} onChange={handleState} autoComplete={"off"} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email <small className='text-secondary'>For Recovery if you forget password</small></Form.Label>
                        <Form.Control name="email" type="email" placeholder="Email" value={email} onChange={handleState} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" type="submit">
                        Save
                    </Button>
                    <Button variant='dark' onClick={onHide}>Close</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default CredentialModal