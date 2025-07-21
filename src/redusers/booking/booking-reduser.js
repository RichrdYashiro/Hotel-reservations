const initialState = {
	id: '',
	roomId: '',
	userId: '',
	userLogin: '',
};

export const bookingReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_BOOKING': {
			return {
				...state,
				roomId: action.payload.roomId,
				userId: action.payload.userId,
				LoginId: action.payload.userId,
			};
		}
		default:
			return state;
	}
};
