const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Получение всех комнат
router.get('/', roomController.getRooms);

// Получение комнаты по ID
router.get('/:id', roomController.getRoomById);

// Создание новой комнаты
router.post('/', roomController.createRoom);

// Обновление комнаты
router.put('/:id', roomController.updateRoom);

module.exports = router;
