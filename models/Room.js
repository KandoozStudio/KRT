const Peer = require("./Peer");

class Room {
    /**
     * @type { Number } the room identifier
     */
    id;
    /**
     * @type { Peer[] } connected peers
    */
    peers = [];

    /**
     * @type { Number } Maximum number of peers the room should have
     */
    maxPeers = 8;
    
    variables = [];
    #currentPlayers = 1;
    #hashedPeers = [];

    /**
     * Sets the room id
     *
     * @param {Number} id
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Sets max number of peers
     *
     * @param {Number} maxPeers
     */
    setMaxPeers(maxPeers) {
        this.maxPeers = maxPeers;
        this.availableSeats = new Array(maxPeers);
        for (let i = 0; i < this.availableSeats.length; i++) {
            this.availableSeats[i] = i + 1;
        }
    }

    /**
     *
     * @param {Peer} peer the peer to add to the room
     * @returns {Number} the new peer ID
     * @throws AppError if maxPeers is reached
     */
    AddPeer(peer) {
        var hash = "o" + peer.oculusAvatarID;
        if (this.#hashedPeers[hash]) {
            peer.id = this.#hashedPeers[hash].id;
        }
        else if (this.peers.length >= this.maxPeers) {
            throw new AppError({ publicMessage: 'Can not add peer, max peers is reached!' });
        }
        else {
            if (peer.isTeacher == "true") {
                peer.id = 0;
            }
            else {
                peer.id = this.#currentPlayers++;
            }
            this.peers.push(peer);
        }
        this.#hashedPeers[hash] = peer;
        this.RegisterPeerMessages(peer);
        this.SendInitMessages(peer);
        return peer.id;

    }

    SendInitMessages(peer) {
        peer.sendMessage("spawn", this, peer.id);
        //peer.sendMessage("movePlayer", {}, peer.id);
        this.BroadcastMessage("spawn", { "peers": [peer] }, peer.id);
    }

    /**
     *
     * @param {SocketIO.Socket} socket the socket used by the peer to Remove
     */
    RemovePeerBySocket(socket) {
        var id = this.peers.findIndex(peer => peer.socket === socket);
        if (id >= 0) {
            var seat = this.peers[id].id;
            this.availableSeats.push(seat);
            this.peers.splice(id, 1);
            this.BroadcastMessage("remove", {}, seat);
            console.log("removed player number " + id + ":" + seat);
        }
        else {
            throw new AppError({ publicMessage: 'Can not remove peer' });
        }
    }

    /**
     *
     * @param {any} id the peer ID
     * @returns {Peer}  the selected Peer
     */
    GetPeerById(id) {
        for (var i = 0; i < this.peers.length; i++) {
            if (this.peers[i].id === id) {
                return this.peers[i];
            }
        }
        return undefined;
    }

    /**
    * @param {string} name The message name
     * @param {string} data the message data
     * @param {Number} sender the Sender
     */
    BroadcastMessage(name, data, sender) {
        for (var i = 0; i < this.peers.length; i++) {
            if (sender !== this.peers[i].id) {
                try {
                    this.peers[i].sendMessage(name, data, sender);
                }
                catch (ex) {
                    console.log(ex);
                }
            }
        }
    }

    RegisterPeerMessages(peer) {
        peer.socket.on("RTMessage", (msg) => {
            this.BroadcastMessage(msg.name, msg.data, msg.senderID);
        });
        peer.socket.on("setVariable", (data) => {
            this.BroadcastMessage("setVariable", msg.data, msg.senderID);
            this.variables[data.name] = data.value;
        });
    }
}

module.exports = Room;
