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

io.on("connection", (socket) => {
    var room;
    try {
        room = app.getRoomById(parseInt( socket.handshake.query.room));
        var peer = new Peer(socket, String(socket.handshake.query.id), String(socket.handshake.query.userName));
        if (!room) {
            peer.sendMessage('error', 'Invalid request!');
            return;
        }
        try {
            peer.setId(room.AddPeer(peer));
        }
        catch (error) {
            peer.sendMessage('error', error.message);
            
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
        var id = room.RemovePeerBySocket(socket);
        if (id >= 0) {
            availableSeats.push(id);
        }
    });
});
