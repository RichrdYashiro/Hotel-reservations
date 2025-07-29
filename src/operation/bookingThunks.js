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
		const response = await fetch('http://localhost:5000/api/bookings/bookings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ roomId, userId }),
		});

		const data = await response.json();

		if (response.ok) {
			dispatch({
				type: 'UPDATE_ROOM_SUCCESS',
				payload: { ...room, reservation: userId },
			});
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

		if (!room) {
			alert('Номер не найден');
			return;
		}

		const response = await fetch('http://localhost:5000/api/bookings/bookings', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ roomId }),
		});

		if (response.ok) {
			dispatch({
				type: 'UPDATE_ROOM_SUCCESS',
				payload: { ...room, reservation: null },
			});
		} else {
			const data = await response.json();
			alert(data.message);
		}
	} catch (error) {
		console.error('Ошибка при отмене бронирования:', error);
		alert('Не удалось отменить бронь');
	}
};
