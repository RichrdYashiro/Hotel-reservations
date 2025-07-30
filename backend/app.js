const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(express.json());
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

mongoose
	.connect(process.env.MONGO_URI, {
		retryWrites: true,
		w: 'majority',
		appName: 'Cluster0',
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`Бэкенд запущен на http://localhost:${port}`);
		});
	})
	.catch((err) => {
		console.error(' Ошибка подключения к MongoDB:', err);
	});
