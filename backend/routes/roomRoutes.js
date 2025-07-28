const express = require('express');
const router = express.Router();
const { getRooms, getRoom, updateRoom } = require('../controllers/roomController');

router.get('/', getRooms);

router.get('/:id', getRoom);

router.patch('/:id', updateRoom);

module.exports = router;
