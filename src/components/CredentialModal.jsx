import React, { useState } from 'react'
import { now } from '../utils'
import { Modal, Button, Form } from 'react-bootstrap'
const CredentialModal = ({ show, onHide, roomId }) => {
    const [password, setPassword] = useState("")
    console.log(password, "modal rendered", roomId)
    const updatePassword = () => {
        const formData = new FormData();
        formData.append("room_id", roomId);
        formData.append("pass", password);
        formData.append("last_modified", now());
        fetch("https://q2w.in/q2wapi/api/updateroom", { method: "POST", body: formData })
            .then((res) => res.json())
            .then(() => {

                // setResData({
                //     ...resData, last_modified: getDateFormat(now())
                // })
            })
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Save Room
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" onClick={updatePassword}>
                    Save
                </Button>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CredentialModal