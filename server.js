const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const proxy = require('http-proxy-middleware');

const SERVERPORT = 3000;

app.use(express.static('public'))

app.get('/', (req, res) => res.sendfile(path.join(__dirname, 'public', 'index.html')))

const createCameraRoute = (i, ip) => app.get(
    `/camera/${i}`, 
    proxy({
        target: `http://192.168.1.${ip}/Streaming/channels/1/preview`, 
        changeOrigin: true, 
        auth:"admin:12345", 
        pathRewrite: {
            [`^/camera/${i}`] : ''
        }
    })
);
createCameraRoute(1, 60);
createCameraRoute(2, 61);
createCameraRoute(3, 62);
createCameraRoute(4, 63);

var micStatus = null;
io.on('connection', function(socket){
    var isWpf = socket.request.headers['socket-client-type'] == "wpf";
    console.log(`a user connected - wpf:${isWpf}`);
    if(isWpf)  {
        socket.on("micOnChange", val => {
            micStatus = val;
            io.emit("micOnChange", micStatus);
        });           
        socket.on("disconnect", () => {
            micStatus = null; 
            io.emit("micOnChange", null);
        });
    }
    else {
        socket.on("toggleMic", val => {
            io.emit("toggleMic");
        })   
        socket.emit("micOnChange", micStatus);
    }
});

http.listen(SERVERPORT, function(){
    console.log(`listening on *:${SERVERPORT}`);
}); 