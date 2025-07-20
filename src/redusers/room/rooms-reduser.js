const initialRoomsState = {
	rooms: [],
	room: null,
	loading: false,
	error: null,
};

export const roomsReducer = (state = initialRoomsState, action) => {
	switch (action.type) {
		case 'GET_ROOMS_REQUEST': {
			return {
				...state,
				loading: true,
				error: null,
			};
		}
		case 'GET_ROOMS_SUCCESS': {
			return {
				...state,
				loading: false,
				rooms: action.payload,
			};
		}
		case 'GET_ROOM_SUCCESS':
			return { ...state, room: action.payload };
		case 'GET_ROOMS_FAILURE': {
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		}
		case 'UPDATE_ROOM_RESERVATION': {
			const { roomId, reservation, userId } = action.payload;

			return {
				...state,
				rooms: state.rooms.map((room) =>
					room.id === roomId
						? { ...room, reservation, reservedBy: userId }
						: room,
				),
			};
		}
		default:
			return state;
	}
};

const initialRoomState = {
	room: null,
};

export const roomReducer = (state = initialRoomState, action) => {
	switch (action.type) {
		case 'GET_ROOM_SUCCESS': {
			return {
				...state,
				room: action.payload,
			};
		}

		default:
			return state;
	}
};
