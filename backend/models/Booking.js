const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
	{
		roomId: { type: String, required: true },
		userId: { type: String, required: true },
	},
	{
		collection: 'bookings',
		timestamps: true,
	},
);

module.exports = mongoose.model('Booking', bookingSchema);
