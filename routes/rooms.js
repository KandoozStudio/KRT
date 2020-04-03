const express = require('express');
const router = express.Router();
const App = require('../models/App');
app = new App();

router.post('/', (req, res, next) => {
    let room = app.generateRoom(req.body.maxPeers);
    res.end({
        roomID: room.id
    });
})

module.exports = router;
