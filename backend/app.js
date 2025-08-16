const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { pool, testConnection } = require('./config/database');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// Настройка CORS для разрешения запросов с фронтенда
app.use(cors({
	origin: ['http://localhost:3000', 'http://localhost:3002'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

// Настройка парсеров для обработки запросов
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(express.json());

// Настройка хранилища сессий в MySQL
const sessionStore = new MySQLStore({
	createDatabaseTable: true,
	connectionLimit: 10,
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'hotel_reservations',
	schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'id',
			expires: 'expires_at',
			data: 'data'
		}
	}
}, pool);

// Настройка сессий
app.use(session({
	key: 'hotel_session',
	secret: process.env.SESSION_SECRET || 'hotel_secret_key',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' // Позволяет отправлять cookie при переходе по ссылкам
	}
}));

// Маршруты API
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));

// Запуск сервера после проверки соединения с базой данных
testConnection()
	.then((connected) => {
		if (connected) {
			app.listen(port, () => {
				console.log(`Бэкенд запущен на http://localhost:${port}`);
			});
		} else {
			console.error('Не удалось подключиться к MySQL. Сервер не запущен.');
			process.exit(1);
		}
	})
	.catch((err) => {
		console.error('Ошибка при запуске сервера:', err);
		process.exit(1);
	});
