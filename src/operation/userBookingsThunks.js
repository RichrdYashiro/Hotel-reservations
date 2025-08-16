import { setUserBookings } from '../actions/booking';

// Получение бронирований пользователя
export const fetchUserBookings = (userId) => async (dispatch) => {
	if (!userId) {
		console.error('Не указан ID пользователя');
		return;
	}

	try {
		const response = await fetch(`http://localhost:5000/api/bookings/user/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // Для работы с сессиями
		});

		if (!response.ok) {
			throw new Error(`Ошибка HTTP: ${response.status}`);
		}

		const bookings = await response.json();
		dispatch(setUserBookings(bookings));
		return bookings;
	} catch (error) {
		console.error('Ошибка при получении бронирований:', error);
		return [];
	}
};