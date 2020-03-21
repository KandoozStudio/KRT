'use strict';
var io = require("socket.io")(3200);

var availableSeats = [];
availableSeats.push(0, 1, 2, 3, 4, 5, 6, 7, 8);

class Peer {
    /**
     * @type {SocketIO.Socket} the socket
     */
    #socket;
    /**
     * 
     * @param {Number} id the ID of the user, used in communication
     * @param {SocketIO.Socket} socket The socket
     */
    constructor(id, socket, oculusAvatarID, name) {
        this.id = id;
        this.name = name | "";
        this.oculusAvatarID = oculusAvatarID|"";
        this.#socket= socket;
    }
    get socket() {
        return this.socket;
    }
    /**
     * 
     * @param {any} message message name
     * @param {any} body message body
     * @param {Number} id userID
     */
    sendMessage(message, body,id) {
        var b = {
            "name": message,
            "data": body,
            "senderID": id
        };
        this.#socket.emit("RTMessage", b );
    }
}

/**
 * 
 * @type {Peer[]} currently connected peers
 * */
var peers = [];
/**
 * @type {int[]} socketid Hashmap
 * */

var socketHashMap = [];
io.on("connection", (socket) => {
    var tmpPeer = new Peer(-1, socket);

    tmpPeer.sendMessage("init", "", -1);

    socket.on("RTMessage", (data) => {
        var msg = data;
        peers.forEach((peer, index) => {
            if (peer.id !== msg.senderID)
            {
                peer.sendMessage(msg.name, msg.data, msg.senderID);
            }
        });

    });
    socket.on("register", (data) => {
        console.log(data);
        var peer = new Peer(availableSeats.shift(), socket, data.data.id, data.data.userName);

        peer.sendMessage("spawn", { "peers": peers }, peer.id);

        peers.forEach((p, index) => {
            if (p.id !== peer.id)
            {
                p.sendMessage("spawn", { "peers": [p] }, peer.id);
            }
        });

        peers[peer.id] = peer;
        socketHashMap[socket] = peer.id;
        console.log(peers);

    });
    socket.on("disconnect", () => {
        var id = socketHashMap[socket];
        peers=peers.filter((p, i) => {
            return i !== id;
        });
        availableSeats.push(id);
    });
});


