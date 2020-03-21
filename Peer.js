class Peer {
    /**
     * @type {SocketIO.Socket} the socket
     */
    #socket;
    /**
     * 
     * @param {Number} id the ID of the user, used in communication
     * @param {SocketIO.Socket} socket The socket
     * @param {String} oculusAvatarID OVRID
     * @param {string} name the user name
     */
    constructor(id, socket, oculusAvatarID, name) {
        this.id = id;
        this.name = name | "";
        this.oculusAvatarID = oculusAvatarID | "";
        this.#socket = socket;
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