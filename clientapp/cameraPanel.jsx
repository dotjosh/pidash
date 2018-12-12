import React from 'react';
import classnames from 'classnames';

export default class CameraPanel extends React.Component 
{
    constructor(){
        super();
        this.state = {
            cacheKill: 1
        };
        // this._resetTimer = window.setInterval(
        //     () => this.setState({ cacheKill: this.state.cacheKill + 1}), 
        //     1000 * 
        // );
    }   

    componentWillUnmount(){
        window.clearInterval(this._resetTimer);
    }

    render(){
        const { onClickCamera, cameraNumber, cameraCount } = this.props;
        const { cacheKill } = this.state;
        return (
            <div className="panel panel-camera">
                {[...Array(cameraCount).keys()]
                    .map(index => <Camera key={index+1} 
                                            cacheKill={cacheKill} 
                                            number={index+1} 
                                            selected={index+1 == cameraNumber} 
                                            onClick={() => onClickCamera(index+1)} />)
                }
            </div>
        );
    }
}

function Camera(props){
    const {number, selected, onClick, cacheKill} = props;
    const className = classnames("panel-camera-item",
    {
        "panel-camera-item-selected": selected
    });
    return (
        <div className={className} onClick={onClick}>
            <img src={`camera/${number}?cacheKill=${cacheKill}`} />
        </div>
    );
}