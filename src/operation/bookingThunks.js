import { fetchUserBookings } from './userBookingsThunks';

export const addBooking = (roomId, userId) => async (dispatch, getState) => {
	console.log('Попытка забронировать:', { roomId, userId });

	if (!userId) {
		alert('Сначала войдите в систему');
		return;
	}

	const state = getState();
	const room = state.rooms.rooms.find((r) => r.id === roomId);

	if (room && room.reservation !== null) {
		alert('Номер уже забронирован');
		return;
	}

	try {
		const response = await fetch('http://localhost:5000/api/bookings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ roomId, userId }),
			credentials: 'include', // Для работы с сессиями
		});

		const data = await response.json();

		if (response.ok) {
			dispatch({
				type: 'UPDATE_ROOM_SUCCESS',
				payload: { ...room, reservation: userId },
			});
			
			// Обновляем список бронирований пользователя
			dispatch(fetchUserBookings(userId));
		} else {
			alert(data.message);
		}
	} catch (error) {
		console.error('Ошибка при бронировании:', error);
		alert('Не удалось забронировать');
	}
};
export const deleteBooking = (roomId) => async (dispatch, getState) => {
	try {
		const state = getState();
		const room = state.rooms.rooms.find((r) => r.id === roomId);
		const userId = state.user.id;

		if (!room) {
			alert('Номер не найден');
			return;
		}

		// Сначала получаем бронирование по roomId
		const bookingsResponse = await fetch(`http://localhost:5000/api/bookings/room/${roomId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		if (!bookingsResponse.ok) {
			const errorData = await bookingsResponse.json();
			alert(errorData.message || 'Не удалось найти бронирование');
			return;
		}

		const bookingData = await bookingsResponse.json();
		if (!bookingData || !bookingData.id) {
			alert('Бронирование не найдено');
			return;
		}

		// Теперь удаляем бронирование по ID
		const response = await fetch(`http://localhost:5000/api/bookings/${bookingData.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});

		if (response.ok) {
			dispatch({
				type: 'UPDATE_ROOM_SUCCESS',
				payload: { ...room, reservation: null },
			});
			
			// Обновляем список бронирований пользователя
			if (userId) {
				dispatch(fetchUserBookings(userId));
			}
		} else {
			const data = await response.json();
			alert(data.message);
		}
	} catch (error) {
		console.error('Ошибка при отмене бронирования:', error);
		alert('Не удалось отменить бронь');
	}
};
