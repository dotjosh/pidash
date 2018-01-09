import React from 'react';
import classnames from 'classnames'

export default class MicPanel extends React.Component {
    render(){
        var { on, onClick } = this.props;
        const iconClassName = classnames(
            "fa",
            "fa-microphone",
            "panel-mic-icon", 
            {
                "panel-mic-icon-disconnected": on == null,
                "panel-mic-icon-off"         : on === false,
                "panel-mic-icon-on"          : on === true
            }
        )
        return (
            <div className="panel panel-mic" onClick={onClick}>
                <i className={iconClassName}></i>
            </div>
        );        
    }
}