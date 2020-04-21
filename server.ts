import {filterImage} from "./backend/src/main"

async function main() {
    var express = require('express');
    var app = express();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    app.use(express.static('frontend'));

    server.listen(80);

    console.log("server started")

    //filterImage([])

    io.on('connection', function (socket) {

        console.log("Connection");
        socket.emit('news', { hello: 'world' });
        
        socket.on('image-upload', async function (data) {

            //console.log(data)

            let filtered = await filterImage(data.buffer)

            console.log(filtered.matrix.length)
            socket.emit('response image', filtered.matrix)

        });
    });
}

main()