import {filterImage, testImage} from "./backend/src/main"

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('frontend'));

server.listen(80);

io.on('connection', function (socket) {

    testImage();

    console.log("Connection");
    socket.emit('news', { hello: 'world' });
    
    socket.on('image-upload', function (data) {

        console.log(data)

        ///filterImage(data.buffer)

        socket.emit('response image', data)

    });
});