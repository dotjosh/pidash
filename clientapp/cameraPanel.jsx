import React from 'react';
import classnames from 'classnames';

export default function CameraPanel(props){
    const { onClickCamera, cameraNumber, cameraCount } = props;
    return (
        <div className="panel panel-camera">
            {[...Array(cameraCount).keys()]
                .map(index => <Camera key={index+1} number={index+1} selected={index+1 == cameraNumber} onClick={() => onClickCamera(index+1)} />)
            }
        </div>
    );
}

function Camera(props){
    const {number, selected, onClick} = props;
    const className = classnames("panel-camera-item",
    {
        "panel-camera-item-selected": selected
    });
    return (
        <div className={className} onClick={onClick}>
            <img src={`camera/${number}`} />
        </div>
    );
}