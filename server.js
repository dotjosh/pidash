const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MjpegProxy = require('./lib/MjpegProxy.js').MjpegProxy;
const fetch = require('node-fetch');
require('dotenv').config();

const SERVERPORT = 3000;
const MINUTE_MS = 60 * 1000;

let state = {
    nest: null,
    mic: null
};

const config = {
    intervals: {
        nest: MINUTE_MS * 3,
        weather: MINUTE_MS * 1
    },
    apikeys: {
        nest: process.env.keys_nest,
        wunderground: process.env.keys_wunderground
    }
}
console.log(config);

configureExpress();

updateNest();
setInterval(updateNest, config.intervals.nest)

updateWeather();
setInterval(updateWeather, config.intervals.weather)

function configureExpress(){
    app.use(express.static('public'))

    app.get('/', (req, res) => res.sendfile(path.join(__dirname, 'public', 'index.html')))
    
    io.on('connection', function(socket){
        var isWpf = socket.request.headers['socket-client-type'] == "wpf";
        console.log(`a user connected - wpf:${isWpf}`);
        if(isWpf)  {
            handleWpfConnect(socket);
        }
        else {
            handleWebConnect(socket);
        } 
    });
    
    createCameraRoute(1, 60);
    createCameraRoute(2, 61);
    createCameraRoute(3, 62);
    createCameraRoute(4, 63);
    
    http.listen(SERVERPORT, function(){
        console.log(`listening on *:${SERVERPORT}`);
    }); 
}

function handleWpfConnect(socket){
    socket.on("micOnChange", val => {
        state = {...state, mic: val};
        console.log(val);
        io.emit("stateChange", state)
    });           
    socket.on("disconnect", () => {
        state = {...state, mic: null};
        io.emit("stateChange", state)
    });
}

function handleWebConnect(socket){
    socket.on("toggleMic", val => {
        io.emit("toggleMic");
    })  
    socket.emit("stateChange", state);    
}

function createCameraRoute(i, ip){ 
    return app.get(
        `/camera/${i}`, 
        new MjpegProxy(`http://admin:12345@192.168.1.${ip}/Streaming/channels/1/preview`).proxyRequest
    );
}

function updateNest(){
    var url = "https://developer-api.nest.com";
    fetch(url, { 
        method: "GET",
        mode: "cors",
        cache: "default",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.apikeys.nest}`
        } 
    })
    .then(x => x.json())
    .then(json => {
        state.nest = json;
        io.emit("stateChange", state);
    })
    .catch(e => console.error(e));    
}

function updateWeather(){
    var dataUrl = `http://api.wunderground.com/api/${config.apikeys.wunderground}/hourly/q/FL/Safety_Harbor.json`;
    var cacheBust = Math.random();
    var rawImageUrl = `http://api.wunderground.com/api/${config.apikeys.wunderground}/animatedradar/q/FL/Safety_Harbor.gif?newmaps=1&timelabel=1&timelabel.y=10&num=5&delay=50`;
    var weather_image = rawImageUrl + "&" + cacheBust; 

    fetch(dataUrl)
    .then(x => x.json())
    .then(json => {
        state.weather_data = json;
        state.weather_image = weather_image;
        io.emit("stateChange", state);
    })
    .catch(e => console.error(e));    
}