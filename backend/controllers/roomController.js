const Room = require('../models/mysql/Room');

const getRooms = async (req, res) => {
	try {
		const rooms = await Room.findAll();
		res.json(rooms);
	} catch (e) {
		console.error('Ошибка при получении комнат:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

const getRoomById = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);

		if (!room) {
			return res.status(404).json({ message: 'Комната не найдена' });
		}

		res.json(room);
	} catch (e) {
		console.error('Ошибка при получении комнаты:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

const createRoom = async (req, res) => {
	try {
		const { title, description, image, price } = req.body;

		if (!title || !description || !image || !price) {
			return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
		}

		const room = await Room.create({
			title,
			description,
			image,
			price,
			reservation: false
		});

		res.status(201).json(room);
	} catch (e) {
		console.error('Ошибка при создании комнаты:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

const updateRoom = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		const room = await Room.findById(id);
		if (!room) {
			return res.status(404).json({ message: 'Комната не найдена' });
		}

		const updatedRoom = await Room.update(id, updateData);
		res.json(updatedRoom);
	} catch (e) {
		console.error('Ошибка при обновлении комнаты:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom };
