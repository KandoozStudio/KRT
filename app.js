'use strict';
const Peer = require("./Peer");
const ClassRoom = require("./ClassRoom");
var io = require("socket.io")(3200);

var availableSeats = [];
availableSeats.push(0, 1, 2, 3, 4, 5, 6, 7, 8);




var classroom = new ClassRoom();
io.on("connection", (socket) => {
    var tmpPeer = new Peer(-1, socket);

    tmpPeer.sendMessage("init", "", -1);

    socket.on("RTMessage", (data) => {
        var msg = data;
        classroom.BroadcastMessage(msg.name, msg.data, msg.senderID);
    });
    socket.on("register", (body) => {
        console.log(body.data);
        var peer = new Peer(availableSeats.shift(), socket, String(body.data.id), String(body.data.userName));
        peer.sendMessage("spawn", classroom, peer.id);
        peer.sendMessage("movePlayer", "", peer.id);
        classroom.BroadcastMessage("spawn", { "peers": [peer] }, peer.id);
        classroom.AddPeer(peer);
        

    });
    socket.on("disconnect", () => {
        var id = classroom.RemovePeerBySocket(socket);
        if (id >= 0) {
            availableSeats.push(id);
        }
        console.log(classroom);
    });
});


