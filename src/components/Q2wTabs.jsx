import React, { useContext, useEffect, useState } from 'react'
import { Tabs, Tab } from "react-bootstrap";
import { RoomContext } from '../store/RoomProvider';
import REGEX from "../constants";

const Q2wTabs = () => {
    const { roomContent } = useContext(RoomContext);
    const [state, setState] = useState({ urls: [], numbers: [] })

    const updateState = () => {
        console.log("updated")
        let urls = roomContent.content.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%+.~#?&//=_]*)/gm)
        urls = urls && urls.map(url => {
            if (url.includes("http")) {
                return url;
            } else {
                return `http://${url}`;
            }
        })
        let numbers = roomContent.content.match(/\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*/gm);
        setState({ ...state, urls: urls !== null ? urls : [], numbers: numbers !== null ? numbers : [] });
    }
    useEffect(() => {
        let timeoutid;
        console.log("you are writing")
        timeoutid = setTimeout(() => {
            updateState()
        }, 2000)
        return () => {
            clearTimeout(timeoutid);
        }
    }, [roomContent.content])
    return (
        <div>
            <Tabs id="uncontrolled-tab-example">
                <Tab eventKey="links" title="Links" className='url overflow-auto'>
                    <ul className="list-group">
                        {state.urls.length === 0 ? <h2>No Links</h2> : state.urls.map((url, i) => (<li key={i} className="list-group-item text-truncate"><a href={url} target="_blank" rel="noreferrer">{url}</a></li>))}
                    </ul>
                </Tab>
                <Tab eventKey="number" title="Numbers" className='url overflow-auto'>
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