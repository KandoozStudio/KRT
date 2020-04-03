'use strict';
const express = require('express');
const Peer = require("./models/Peer");
const App = require("./models/App");
var io = require("socket.io")(3200);

const expressApp = express();
var app = new App();

app.generateRoom(); //for testing
app.generateRoom(); //for testing
app.generateRoom(); //for testing

let routes = require('./routes');
expressApp.use(routes);

io.on("connection", (socket) => {
    var room;
    try {
        room = app.getRoomById(socket.handshake.query.room);
    }
    catch (error) {
        console.log('error! ', error.message);
    }

    socket.on("RTMessage", (data) => {
        var msg = data;
        room.BroadcastMessage(msg.name, msg.data, msg.senderID);
    });

    socket.on("register", (body) => {
        var peer = new Peer(socket, String(body.data.id), String(body.data.userName));
        if (!room) {
            peer.sendMessage('error', 'Invalid request!');
            return;
        }
        try {
            peer.setId(room.AddPeer(peer));
        }
        catch (error) {
            peer.sendMessage('error', error.message)
        }
        peer.sendMessage("spawn", room, peer.id);
        peer.sendMessage("movePlayer", {}, peer.id);
        room.BroadcastMessage("spawn", { "peers": [peer] }, peer.id);
    });

    socket.on("disconnect", () => {
        var id = room.RemovePeerBySocket(socket);
        if (id >= 0) {
            availableSeats.push(id);
        }
    });
});
