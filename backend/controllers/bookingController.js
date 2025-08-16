const Booking = require('../models/mysql/Booking');
const Room = require('../models/mysql/Room');

const createBooking = async (req, res) => {
	try {
		const { userId, roomId } = req.body;

		if (!userId || !roomId) {
			return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
		}

		const room = await Room.findById(roomId);

		if (!room) {
			return res.status(404).json({ message: 'Комната не найдена' });
		}

		if (room.reservation) {
			return res.status(400).json({ message: 'Комната уже забронирована' });
		}

		// Создаем бронирование
		const booking = await Booking.create({
			user_id: userId,
			room_id: roomId,
			date: new Date()
		});

		// Обновляем статус комнаты
		await Room.update(roomId, { reservation: true });

		// Возвращаем созданное бронирование
		res.status(201).json({ 
			message: 'Бронирование создано', 
			booking: {
				id: booking.id,
				userId: booking.user_id,
				roomId: booking.room_id,
				date: booking.date
			}
		});
	} catch (e) {
		console.error('Ошибка при создании бронирования:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

const deleteBooking = async (req, res) => {
	try {
		const { id } = req.params;

		// Находим бронирование
		const booking = await Booking.findById(id);

		if (!booking) {
			return res.status(404).json({ message: 'Бронирование не найдено' });
		}

		// Обновляем статус комнаты
		const room = await Room.findById(booking.room_id);
		if (room) {
			await Room.update(booking.room_id, { reservation: false });
		}

		// Удаляем бронирование
		await Booking.delete(id);

		res.json({ message: 'Бронирование удалено' });
	} catch (e) {
		console.error('Ошибка при удалении бронирования:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

const getBookingsByUserId = async (req, res) => {
	try {
		const { userId } = req.params;

		// Получаем все бронирования пользователя
		const bookings = await Booking.findByUserId(userId);

		// Получаем информацию о комнатах для каждого бронирования
		const bookingsWithRooms = await Promise.all(
			bookings.map(async (booking) => {
				const room = await Room.findById(booking.room_id);
				return {
					id: booking.id,
					userId: booking.user_id,
					roomId: booking.room_id,
					date: booking.date,
					room: room || { title: 'Комната не найдена' }
				};
			})
		);

		res.json(bookingsWithRooms);
	} catch (e) {
		console.error('Ошибка при получении бронирований:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

const getBookingByRoomId = async (req, res) => {
	try {
		const { roomId } = req.params;

		// Находим бронирование по ID комнаты
		const booking = await Booking.findOne({ roomId });

		if (!booking) {
			return res.status(404).json({ message: 'Бронирование не найдено' });
		}

		res.json(booking);
	} catch (e) {
		console.error('Ошибка при получении бронирования:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

module.exports = { createBooking, deleteBooking, getBookingsByUserId, getBookingByRoomId };
