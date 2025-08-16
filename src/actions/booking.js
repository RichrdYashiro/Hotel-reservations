import {
	ADD_BOOKING,
	UPDATE_ROOM_RESERVATION,
	DELETE_ROOM_RESERVATION,
	SET_USER_BOOKINGS,
} from '../types/bookingTypes';

export const addBookingAction = (roomId, userId) => ({
	type: ADD_BOOKING,
	payload: { roomId, userId },
});

export const updateRoomReservation = (roomId, userId) => ({
	type: UPDATE_ROOM_RESERVATION,
	payload: { roomId, userId },
});

export const deleteRoomReservation = (roomId) => ({
	type: DELETE_ROOM_RESERVATION,
	payload: { roomId },
});

export const setUserBookings = (bookings) => ({
	type: SET_USER_BOOKINGS,
	payload: bookings,
});
