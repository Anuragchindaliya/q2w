import React, { useContext, useEffect, useState } from 'react'
import { Tabs, Tab } from "react-bootstrap";
import { RoomContext } from '../store/RoomProvider';


const Q2wTabs = () => {
    const { roomLinks } = useContext(RoomContext);
    const [state, setState] = useState({ urls: [], numbers: [] })

    useEffect(() => {
        if (roomLinks.urls.length !== state.urls.length || roomLinks.numbers.length !== state.numbers.length) {
            setState(roomLinks)
        }
    }, [roomLinks.urls, roomLinks.numbers])
    return (
        <div>
            <Tabs id="uncontrolled-tab-example">
                <Tab eventKey="links" title="Links" className='url overflow-auto custom-scroll'>
                    <ul className="list-group">
                        {roomLinks.urls.length === 0 ? <h2>No Links</h2> : state.urls.map((url, i) => (<li key={i} className="list-group-item text-truncate"><a href={url} target="_blank" rel="noreferrer">{url}</a></li>))}
                    </ul>
                </Tab>
                <Tab eventKey="number" title="Numbers" className='url overflow-auto custom-scroll'>
                    <ul className="list-group">
                        {roomLinks.numbers.length === 0 ? <h2 className='text-center'>No Numbers</h2> : state.numbers.map((url, i) => (<li key={i} className="list-group-item text-truncate"><a href={"tel:" + url}>{url}</a></li>))}
                    </ul>
                </Tab>
                <Tab eventKey="contact" title="Contact ">
                    dff
                </Tab>
            </Tabs>
        </div>
    )
}

export default Q2wTabs;