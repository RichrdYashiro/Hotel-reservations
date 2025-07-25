import { ADD_BOOKING } from '../../types/bookingTypes';

const initialState = {
	id: '',
	roomId: '',
	userId: '',
	userLogin: '',
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
		default:
			return state;
	}
};
