export const addBooking = (roomId, userId) => async (dispatch, getState) => {
	const state = getState();
	const room = state.rooms.rooms.find((room) => room.id === roomId);

	if (room && room.reservation !== null) {
		alert('Эта комната уже забронирована');
		return;
	}

	try {
		const oldBookings = await fetch(`http://localhost:3005/booking?roomId=${roomId}`);
		const oldBookingsData = await oldBookings.json();
		for (const booking of oldBookingsData) {
			await fetch(`http://localhost:3005/booking/${booking.id}`, {
				method: 'DELETE',
			});
		}

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
		const response = await fetch(`http://localhost:3005/booking?roomId=${roomId}`);
		const bookings = await response.json();

		for (const booking of bookings) {
			await fetch(`http://localhost:3005/booking/${booking.id}`, {
				method: 'DELETE',
			});
		}

		dispatch({
			type: 'DELETE_ROOM_RESERVATION',
			payload: { roomId },
		});
	} catch (error) {
		console.error('Ошибка при отмене бронирования:', error);
		alert('Не удалось отменить бронь');
	}
};
