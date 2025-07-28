const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
	try {
		const rooms = await Room.find();
		res.json(rooms);
	} catch (err) {
		res.status(500).json({ message: 'Ошибка загрузки номеров' });
	}
};

exports.getRoom = async (req, res) => {
	try {
		const room = await Room.findOne({ id: req.params.id });
		if (!room) {
			return res.status(404).json({ message: 'Номер не найден' });
		}
		res.json(room);
	} catch (err) {
		res.status(500).json({ message: 'Ошибка загрузки номера' });
	}
};

exports.updateRoom = async (req, res) => {
	try {
		const room = await Room.findOneAndUpdate({ id: req.params.id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!room) {
			return res.status(404).json({ message: 'Номер не найден' });
		}
		res.json(room);
	} catch (err) {
		res.status(500).json({ message: 'Ошибка обновления номера' });
	}
};
