const initialState = {
	bookings: [],
	reservation: false,
};

export const bookingReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_BOOKING': {
			const { room_id, user_id } = action.payload;

			return {
				...state,
				bookings: [...state.bookings, { room_id, user_id }],
			};
		}
		case 'DELETE_BOOKING': {
			const { room_id } = action.payload;
			return {
				...state,
				bookings: state.bookings.filter((booking) => booking.room_id !== room_id),
			};
		}
		default:
			return state;
	}
};
