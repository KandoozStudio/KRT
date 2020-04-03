class Peer {
    /**
     * @type {SocketIO.Socket} the socket
     */
    #socket;

    /**
     * @type {Number} id the ID of the user, used in communication
     */
    id;

    /**
     *
     * @param {SocketIO.Socket} socket The socket
     * @param {String} oculusAvatarID OVRID
     * @param {string} name the user name
     */
    constructor(socket, oculusAvatarID, name) {
        this.name = name ;
        this.oculusAvatarID = oculusAvatarID ;
        this.#socket = socket;
    }

    /**
     * Sets the peer id
     *
     * @param {Number} id the ID to set
     */
    setId(id) {
        this.id = id;
     }

    get socket() {
        return this.#socket;
    }
    /**
     *
     * @param {any} message message name
     * @param {any} body message body
     * @param {Number} id userID
     */
    sendMessage(message, body, id) {
        var b = {
            "name": message,
            "data": body,
            "senderID": id
        };
        this.#socket.emit("RTMessage", b);
    }
}

module.exports = Peer;
