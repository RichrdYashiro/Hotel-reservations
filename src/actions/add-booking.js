export const addBooking = (roomId, userId) => async (dispatch, getState) => {
	const state = getState();
	const room = state.rooms.rooms.find((room) => room.id === roomId);

	if (room && room.reservation !== null) {
		alert('Эта комната уже забронирована');
		return;
	}

	try {
		dispatch({
			type: 'UPDATE_ROOM_RESERVATION',
			payload: { roomId, userId },
		});

		await fetch(`http://localhost:3005/rooms/${roomId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ reservation: userId }),
		});

		await fetch(`http://localhost:3005/booking`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: Date.now().toString(), roomId, userId }),
		});
	} catch (error) {
		console.error('Не удалось забронировать:', error);
		alert('Ошибка при бронировании');
	}
};

export const deleteBooking = (roomId) => async (dispatch) => {
	try {
		await fetch(`http://localhost:3005/rooms/${roomId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ reservation: null }),
		});

		dispatch({
			type: 'DELETE_ROOM_RESERVATION',
			payload: { roomId },
		});
	} catch (error) {
		console.error('Ошибка при отмене бронирования:', error);
		alert('Не удалось отменить бронь');
	}
};
