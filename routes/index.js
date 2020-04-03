const express = require('express');
const router = express.Router();
const roomRoutes = require('./rooms');

router.use('/rooms', roomRoutes);

module.exports = router;
