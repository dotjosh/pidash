import React from 'react';
import MicPanel from './micpanel.jsx'
import CameraPanel from './camerapanel.jsx'

export default function Root(props){
    const { micOn, cameraNumber, onClickMic, onClickCamera } = props; 
    return (
        <div className="panels">
            <MicPanel 
                on={micOn} 
                onClick={onClickMic} />
            <CameraPanel 
                cameraNumber={cameraNumber} 
                onClickCamera={onClickCamera}/>
        </div>
    );
}
