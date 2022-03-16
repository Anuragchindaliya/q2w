import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Q2wTabs from './Q2wTabs';

// const Header = () => {
//     return <nav className="navbar navbar-dark bg-dark navbar-fixed-top text-center">
//         <div className="container-fluid">
//             <div className="navbar-header">
//                 <a className="navbar-brand" href="#/">  <img src='/q2w/assets/img/q2w-logo.svg' style={{ width: "50px", padding: "0 5px" }} alt="Brand logo" />
//                     Query-2-Write
//                 </a>
//             </div>
//         </div>
//     </nav>;
// };

const Header = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <nav className="navbar navbar-expand-lg navbar-light bg-dark navbar-dark">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">
                <img src='./assets/img/q2w-logo.svg' style={{ width: "50px", padding: "0 5px" }} alt="Brand logo" />                  Query-2-Write
            </Link>
            <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={handleShow}>
                <span className="navbar-toggler-icon" />
            </button>

        </div>
        <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                Some text as placeholder. In real life you can have the elements you
                have chosen. Like, text, images, lists, etc.
            </Offcanvas.Body>
        </Offcanvas>
    </nav>;
};

export default Header;
