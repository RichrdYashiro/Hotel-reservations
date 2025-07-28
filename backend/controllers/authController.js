const User = require('../models/Users');
const bcrypt = require('bcryptjs');

exports.authorize = async (req, res) => {
	const { login, password } = req.body;

	try {
		const user = await User.findOne({ login });
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Неверный пароль' });
		}

		res.json({
			userId: user._id,
			login: user.login,
			role_id: user.role_id,
		});
	} catch (err) {
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};

exports.register = async (req, res) => {
	const { login, password } = req.body;

	try {
		const existingUser = await User.findOne({ login });
		if (existingUser) {
			return res.status(400).json({ message: 'Логин уже занят' });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			login,
			password: hashedPassword,
			role_id: 1,
		});

		await user.save();
		res.status(201).json({ userId: user._id, login, role_id: user.role_id });
	} catch (err) {
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};
