const mysql = require('mysql2/promise');
require('dotenv').config();

// Создаем пул соединений с MySQL
const pool = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'hotel_reservations',
	waiting_for_connections: true,
	connection_limit: 10,
	queue_limit: 0
});

// Проверка соединения
const testConnection = async () => {
	try {
		const connection = await pool.getConnection();
		console.log('MySQL соединение установлено успешно');
		connection.release();
		return true;
	} catch (error) {
		console.error('Ошибка соединения с MySQL:', error);
		return false;
	}
};

module.exports = {
	pool,
	testConnection
};