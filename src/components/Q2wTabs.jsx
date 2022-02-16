import React from 'react'
import { Tabs, Tab } from "react-bootstrap";

const Q2wTabs = ({ state }) => {
    return (
        <div>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" defaultActiveKey="links" >
                <Tab eventKey="links" title="Links" className='url overflow-auto'>
                    <ul className="list-group">
                        {state.urls.length === 0 ? <h2>No Links</h2> : state.urls.map((url, i) => (<li key={i} className="list-group-item text-truncate"><a href={url} target="_blank" rel="noreferrer">{url}</a></li>))}
                    </ul>
                </Tab>
                <Tab eventKey="number" title="Numbers">
                    <ul className="list-group">
                        {state.numbers.length === 0 ? <h2 className='text-center'>No Numbers</h2> : state.numbers.map((url, i) => (<li key={i} className="list-group-item text-truncate"><a href={"tel:" + url}>{url}</a></li>))}
                    </ul>
                </Tab>
                <Tab eventKey="contact" title="Contact">
                    dff
                </Tab>
            </Tabs>
        </div>
    )
}

export default Q2wTabs