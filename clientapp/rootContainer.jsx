import React from 'react';
import ioClient from 'socket.io-client'
import Root from './root.jsx'

const EVENTNAMES = {
    connect: "connect",
    stateChange: "stateChange",
    disconnect: "disconnect",
    toggleMic: "toggleMic"
};

const CAMERACOUNT = 4;

var url = window.location.href;
var splitUrl = url.split("/");
const io = ioClient(splitUrl[0] + "//" + splitUrl[2])

export default class RootContainer extends React.Component {
    constructor(){
        super();
        this.state = { 
            serverState: null,
            cameraNumber: null
        };
        
        this.onClickMic = this.onClickMic.bind(this);
        this.onClickCamera = this.onClickCamera.bind(this);
    }

    componentDidMount(){
        io.on(EVENTNAMES.connect, () => console.log("CONNECTED"));
        io.on(EVENTNAMES.stateChange, serverState => this.setState({ serverState }));
        io.on(EVENTNAMES.disconnect, () => this.setState({serverState: null}));
    }

    componentWillMount(){
        [EVENTNAMES.stateChange, EVENTNAMES.disconnect].forEach(io.off);
    }

    onClickMic(){
        io.emit(EVENTNAMES.toggleMic);
    }

    onClickCamera(clickedCameraNumber){
        let newCameraNumber;
        if(clickedCameraNumber == this.state.cameraNumber){
            newCameraNumber = null;
        }
        else {
            newCameraNumber = clickedCameraNumber;
        }
        this.setState({ cameraNumber: newCameraNumber })
    }
    
    render(){
        return <Root {...this.state}
                    cameraCount={CAMERACOUNT}
                    onClickMic={this.onClickMic} 
                    onClickCamera={this.onClickCamera} />
    }
}
