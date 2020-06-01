'use strict';
const express = require('express');
const Peer = require("./models/Peer");
const app = require("./models/App");
var io = require("socket.io")(3200);

const expressApp = express();

app.generateRoom(); //for testing
app.generateRoom(); //for testing
app.generateRoom(); //for testing

let routes = require('./routes');
expressApp.use(routes);
expressApp.listen(3400)

setInterval(() => {
    console.log(app.rooms);
}, 4000);
io.on("connection", (socket) => {
    var room;
    try {
        room = app.getRoomById(parseInt(socket.handshake.query.room));
        var peer = new Peer(socket, String(socket.handshake.query.id), String(socket.handshake.query.userName));
        peer.isTeacher = socket.handshake.query.isTeacher || false;

        if (!room) {
            peer.sendMessage('error', 'Invalid request!');
            return;
        }
        try {
            peer.setId(room.AddPeer(peer));
        }
        catch (error) {
            peer.sendMessage('error', error.message);
            console.log(error.message);

        }
        peer.sendMessage("spawn", room, peer.id);
        peer.sendMessage("movePlayer", {}, peer.id);
        room.BroadcastMessage("spawn", { "peers": [peer] }, peer.id);
    }
    catch (error) {
        console.log('error! ', error.message);
    }

    socket.on("RTMessage", (data) => {
        var msg = data;
        room.BroadcastMessage(msg.name, msg.data, msg.senderID);
    });
    socket.on("disconnect", () => {
        try {
            room.RemovePeerBySocket(socket);
            console.log(room);
        }
        catch (error) {
            console.log(error.message);
        }
    });
});
