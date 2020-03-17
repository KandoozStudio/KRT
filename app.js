'use strict';
var io = require("socket.io")(3200);

var availableSeats = [];
availableSeats.push(0, 1, 2, 3, 4, 5, 6);

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
    constructor(id, socket) {
        this.id = id;
        this.name = "";
        this.oculusAvatarID = "";
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
        this.#socket.emit("msg", b );
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
    InitializePeer(socket);
    socket.on("msg", (data) => {
        var msg = data;
        peers.forEach((peer, index) => {
            if (peer.id !== msg.senderID)// don't send it back to sender
            {
                peer.sendMessage(msg.name, msg.data, msg.senderID);
            }
        });
    });
    socket.on("register", (data) => {
        var id = socketHashMap[socket];
        peers[id].name = data.name;
        peers[id].oculusAvatarID = data.oculusAvatarID;
    });
    socket.on("disconnect", () => {
        var id = socketHashMap[socket];
        peers=peers.filter((p, i) => {
            return i !== id;
        });
        availableSeats.push(id);
    });
});

/**
 * @param {SocketIO.Socket} socket useer socket
 * 
 */
function InitializePeer(socket) {
    var peer = new Peer(availableSeats.shift(), socket);
    peer.sendMessage("Init", { "peers": peers }, peer.id);
    peers[peer.id] = peer;
    socketHashMap[socket] = peer.id;
}
