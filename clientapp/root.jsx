import React from 'react';
import MicPanel from './micpanel.jsx'
import CameraPanel from './camerapanel.jsx'

export default function Root(props){
    const { serverState, cameraNumber, onClickMic, onClickCamera, cameraCount } = props; 
    const { mic, nest, weather_data, weather_image } = (serverState || {});
    const thermostat = getThermostat(nest);
    const outsideTemp = getOutsideTemp(weather_data);

    return (
        <div className="panels">
            <div className="panels-left">
                <MicPanel 
                    on={mic} 
                    onClick={onClickMic} />
                <Statistic label="Inside" text={<span>{thermostat.ambient_temperature_f}&#176;</span>} />
                <Statistic label="NEST" text={<span>{thermostat.target_temperature_f}&#176;</span>} />
                <Statistic label="Outside" text={<span>{outsideTemp}&#176;</span>} />
                <WeatherWidget weather_image={weather_image} />
            </div>
            <CameraPanel 
                cameraNumber={cameraNumber} 
                cameraCount={cameraCount}
                onClickCamera={onClickCamera}/>
        </div>
    );
}
  
function getThermostat(nest){
    return (
        nest
        && nest.devices
        && nest.devices.thermostats
        && Object.keys(nest.devices.thermostats).length
        && nest.devices.thermostats[Object.keys(nest.devices.thermostats)[0]]
    ) || {};
}

function getOutsideTemp(weather){
    var temp = (
        weather
        && weather.hourly_forecast
        && weather.hourly_forecast.length
        && weather.hourly_forecast[0]
        && weather.hourly_forecast[0].temp
        && weather.hourly_forecast[0].temp.english
    );
    return Math.trunc(temp || 0);
}

function Statistic(props){
    return (
        <div className="statistic">
            <div className="statistic-text">{props.text}</div>
            <div className="statistic-label">{props.label}</div>
        </div>
    );
}

function WeatherWidget(props){
    const { data, weather_image } = props;
    
    return (
        <div className="panel panel-weather">
            <div className="panel-weather-pic"><img src={weather_image}/></div>
        </div>
    );
}