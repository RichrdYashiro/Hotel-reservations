const express = require('express');
const router = express.Router();
const { createBooking, deleteBooking } = require('../controllers/bookingController');

router.post('/bookings', createBooking);
router.delete('/bookings', deleteBooking);

module.exports = router;
