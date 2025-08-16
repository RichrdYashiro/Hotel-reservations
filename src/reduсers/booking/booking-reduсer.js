import { ADD_BOOKING, SET_USER_BOOKINGS } from '../../types/bookingTypes';

const initialState = {
	id: '',
	roomId: '',
	userId: '',
	userLogin: '',
	userBookings: [],
};

export const bookingReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_BOOKING: {
			return {
				...state,
				roomId: action.payload.roomId,
				userId: action.payload.userId,
			};
		}
		case SET_USER_BOOKINGS: {
			return {
				...state,
				userBookings: action.payload,
			};
		}
		default:
			return state;
	}
};
