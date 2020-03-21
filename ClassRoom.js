const Peer = require("./Peer");

class ClassRoom {
    /**
     * @type { Peer[] } connected peers
    */
    peers = [];

    /**
     * 
     * @param {Peer} peer the peer to add to the room
     */
    AddPeer(peer) {
        this.peers.push(peer);
    }

    /**
     * 
     * @param {SocketIO.Socket} socket the socket used by the peer to Remove
     * @returns {Number} the Id of the removed player
     */
    RemovePeerBySocket(socket) {
        for (var i = 0; i < this.peers.length; i++) {
            if (this.peers[i].socket === socket) {
                id = this.peers.id;
                this.peers[i].sendMessage("delete", "", this.peers[i].id);
                this.peers = this.peers.splice(i, 1);
                return id;
            }
        }
        return -1;
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
                this.peers[i].sendMessage(name, data, sender);

            }
        }
    }
}

module.exports = ClassRoom;