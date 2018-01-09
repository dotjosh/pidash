import React from 'react';
import ioClient from 'socket.io-client'
import Root from './root.jsx'

const EVENTNAMES = {
    micOnChange: "micOnChange",
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
            micOn: null, 
            cameraNumber: 1
        };
        
        this.onClickMic = this.onClickMic.bind(this);
        this.onClickCamera = this.onClickCamera.bind(this);
    }

    componentDidMount(){
        io.on(EVENTNAMES.micOnChange, micOn => this.setState({ micOn }));
        io.on(EVENTNAMES.disconnect, () => this.setState({micOn: null}));
    }

    componentWillMount(){
        [EVENTNAMES.micOnChange, EVENTNAMES.disconnect].forEach(io.off);
    }

    onClickMic(){
        io.emit(EVENTNAMES.toggleMic);
    }

    onClickCamera(){
        const { cameraNumber } = this.state;
        const newCameraNumber = cameraNumber === CAMERACOUNT 
                                ? 1 
                                : cameraNumber + 1;
        this.setState({ cameraNumber: newCameraNumber })
    }
    
    render(){
        return <Root {...this.state}
                    onClickMic={this.onClickMic} 
                    onClickCamera={this.onClickCamera} />
    }
}
