const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = async (req, res) => {
	const { roomId, userId } = req.body;

	try {
		const existingBooking = await Booking.findOne({ roomId });
		if (existingBooking) {
			return res.status(400).json({ message: 'Номер уже забронирован' });
		}

		const room = await Room.findOne({ id: roomId });
		if (!room) {
			return res.status(404).json({ message: 'Номер не найден' });
		}

		const booking = new Booking({ roomId, userId });
		await booking.save();

		await Room.findOneAndUpdate({ id: roomId }, { reservation: userId });

		res.status(201).json(booking);
	} catch (err) {
		console.error('Ошибка в createBooking:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};

exports.deleteBooking = async (req, res) => {
	const { roomId } = req.body;

	try {
		const booking = await Booking.findOneAndDelete({ roomId });
		if (!booking) {
			return res.status(404).json({ message: 'Бронь не найдена' });
		}

		await Room.findOneAndUpdate({ id: roomId }, { reservation: null });

		res.json({ message: 'Бронь отменена' });
	} catch (err) {
		res.status(500).json({ message: 'Ошибка при отмене брони' });
	}
};
