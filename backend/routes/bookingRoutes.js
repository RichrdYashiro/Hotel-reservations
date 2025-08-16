const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Создание бронирования
router.post('/', bookingController.createBooking);

// Удаление бронирования
router.delete('/:id', bookingController.deleteBooking);

// Получение бронирований пользователя
router.get('/user/:userId', bookingController.getBookingsByUserId);

// Получение бронирования по ID комнаты
router.get('/room/:roomId', bookingController.getBookingByRoomId);

module.exports = router;
