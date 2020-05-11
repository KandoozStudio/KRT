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
    variables=[];
    /**
     * @type { Number } Maximum number of peers the room should have
     */
    maxPeers = 8;

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
    }

    /**
     *
     * @param {Peer} peer the peer to add to the room
     * @returns {Number} the new peer ID
     * @throws AppError if maxPeers is reached
     */
    AddPeer(peer) {
        if (this.peers.length >= this.maxPeers) {
            throw new AppError({ publicMessage: 'Can not add peer, max peers is reached!' });
        }
        peer.socket.on("RTMessage",(msg)=>{
            this.BroadcastMessage(msg.name, msg.data, msg.senderID);
        });
        peer.socket.on("setVariable",(data)=>{
            this.BroadcastMessage("setVariable", msg.data, msg.senderID);
            this.variables[data.name]=data.value;
        });
        return this.peers.push(peer);
    }

    /**
     *
     * @param {SocketIO.Socket} socket the socket used by the peer to Remove
     * @returns {Number} the Id of the removed player
     */
    RemovePeerBySocket(socket) {
        for (var i = 0; i < this.peers.length; i++) {
            if (this.peers[i].socket === socket) {
                var id = this.peers[i].id;
                this.peers[i].sendMessage("remove", {}, this.peers[i].id);
                console.log("removed player number " + id + ":" + i);
                this.peers.splice(i, 1);
                return id;
            }
        }
        console.log("could not remove shit" );

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

module.exports = Room;
