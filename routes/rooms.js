const express = require('express');
const router = express.Router();
const app = require('../models/App');

router.post('/', (req, res, next) => {
    let room = app.generateRoom();
    if (req.body && req.body.maxPeers) {
        room.setMaxPeers(req.body.maxPeers);
    }
    return res.json({
        roomID: room.id
    });
})

module.exports = router;
