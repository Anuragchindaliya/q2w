import React from 'react';

const Header = () => {
    return <nav className="navbar navbar-dark bg-dark navbar-fixed-top text-center">
        <div className="container-fluid">
            <div className="navbar-header">
                <a className="navbar-brand" href="#/">  <img src='/q2w/assets/img/q2w-logo.svg' style={{ width: "50px", padding: "0 5px" }} alt="Brand logo" />
                    Query-2-Write
                </a>
                {/* D:\react\q2w\public\assets\img\q2w-logo.svg */}
            </div>
        </div>
    </nav>;
};

export default Header;
