const User = require('../models/mysql/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
	try {
		const { login, password } = req.body;

		if (!login || !password) {
			return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
		}

		const user = await User.findByLogin(login);

		if (!user) {
			return res.status(400).json({ message: 'Пользователь не найден' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
		}

		// Создаем JWT токен
		const token = jwt.sign(
			{ userId: user.id, role_id: user.role_id }, 
			process.env.JWT_SECRET || 'hotel', 
			{ expiresIn: '1h' }
		);

		// Сохраняем информацию о пользователе в сессии
		req.session.user = {
			id: user.id,
			login: user.login,
			role_id: user.role_id
		};

		// Сохраняем сессию
		req.session.save(err => {
			if (err) {
				console.error('Ошибка при сохранении сессии:', err);
			}
		});

		res.json({ token, userId: user.id, role_id: user.role_id });
	} catch (e) {
		console.error('Ошибка при входе:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

const register = async (req, res) => {
	try {
		const { login, password } = req.body;

		if (!login || !password) {
			return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
		}

		const candidate = await User.findByLogin(login);

		if (candidate) {
			return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await User.create({
			login,
			password: hashedPassword,
			role_id: 2, // Обычный пользователь
		});

		res.status(201).json({ message: 'Пользователь создан' });
	} catch (e) {
		console.error('Ошибка при регистрации:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

// Проверка авторизации пользователя по сессии
const checkAuth = async (req, res) => {
	try {
		// Проверяем наличие пользователя в сессии
		if (req.session && req.session.user) {
			const user = await User.findById(req.session.user.id);
			
			if (user) {
				// Обновляем токен
				const token = jwt.sign(
					{ userId: user.id, role_id: user.role_id }, 
					process.env.JWT_SECRET || 'hotel', 
					{ expiresIn: '1h' }
				);
				
				return res.json({ token, userId: user.id, role_id: user.role_id });
			}
		}
		
		// Если пользователь не найден в сессии или в базе данных
		res.status(401).json({ message: 'Не авторизован' });
	} catch (e) {
		console.error('Ошибка при проверке авторизации:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

// Выход из системы
const logout = (req, res) => {
	try {
		// Уничтожаем сессию
		req.session.destroy(err => {
			if (err) {
				console.error('Ошибка при выходе из системы:', err);
				return res.status(500).json({ message: 'Ошибка при выходе из системы' });
			}
			
			// Очищаем cookie сессии
			res.clearCookie('hotel_session');
			res.json({ message: 'Выход выполнен успешно' });
		});
	} catch (e) {
		console.error('Ошибка при выходе из системы:', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
};

module.exports = { register, login, checkAuth, logout };
