export const getRoomsRequest = () => ({
	type: 'GET_ROOMS_REQUEST',
});

export const getRoomSuccess = (room) => ({
	type: 'GET_ROOM_SUCCESS',
	payload: room,
});

export const getRoomsSuccess = (rooms) => ({
	type: 'GET_ROOMS_SUCCESS',
	payload: rooms,
});

export const getRoomsFailure = (error) => ({
	type: 'GET_ROOMS_FAILURE',
	payload: error,
});
export const updateRoomSuccess = (room) => ({
	type: 'UPDATE_ROOM_SUCCESS',
	payload: room,
});

export const fetchRooms = () => {
	return async (dispatch) => {
		dispatch(getRoomsRequest());
		try {
			const response = await fetch('http://localhost:3005/rooms');
			if (!response.ok) throw new Error('Ошибка при загрузке');
			const data = await response.json();
			dispatch(getRoomsSuccess(data));
		} catch (err) {
			dispatch(getRoomsFailure(err.message));
		}
	};
};
export const getRoom = (id) => async (dispatch) => {
	const response = await fetch(`http://localhost:3005/rooms/${id}`);
	if (!response.ok) throw new Error('Ошибка загрузки комнаты');
	const data = await response.json();

	dispatch(getRoomSuccess(data));
};

export const editRoom = (id, updatedData) => async (dispatch) => {
	try {
		const response = await fetch(`http://localhost:3005/rooms/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedData),
		});

		if (!response.ok) {
			const errorText = await response.text();
			return {
				error: `Ошибка при обновлении комнаты: ${response.status} ${errorText}`,
			};
		}

		const updatedRoom = await response.json();

		dispatch(updateRoomSuccess(updatedRoom));

		return { res: updatedRoom };
	} catch (error) {
		return { error: `Ошибка сети: ${error.message}` };
	}
};
