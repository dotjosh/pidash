import React from 'react';

export default function CameraPanel(props){
    const {cameraNumber, onClickCamera} = props;
    return (
        <div className="panel panel-camera" onClick={onClickCamera}>
            <SingleCamera cameraNumber={cameraNumber} />
        </div>
    );
}

function SingleCamera(props){
    const {cameraNumber} = props;
    return <img src={`camera/${cameraNumber}`} className="panel-camera-singleitem"/>
}
