export const addBooking = (room_id, user_id) => (dispatch) => {
	dispatch({
		type: 'ADD_BOOKING',
		payload: { room_id, user_id },
	});

	dispatch({
		type: 'UPDATE_ROOM_RESERVATION',
		payload: { roomId: room_id, reservation: true, userId: user_id },
	});
};
export const deleteBooking = (room_id) => ({
	type: 'DELETE_BOOKING',
	payload: { room_id },
});
