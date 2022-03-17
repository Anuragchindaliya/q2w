
import { Link } from 'react-router-dom';

const Header = ({ handleShow }) => {


    return <nav className="navbar navbar-expand-lg navbar-light bg-dark navbar-dark">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">
                <img src='./assets/img/q2w-logo.svg' style={{ width: "50px", padding: "0 5px" }} alt="Brand logo" />
                Query-2-Write
            </Link>
            <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={handleShow}>
                <span className="navbar-toggler-icon" />
            </button>
        </div>
    </nav>;
};

export default Header;
