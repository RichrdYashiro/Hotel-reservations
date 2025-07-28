import {
	GET_ROOMS_REQUEST,
	GET_ROOMS_SUCCESS,
	GET_ROOMS_FAILURE,
	GET_ROOM_SUCCESS,
	UPDATE_ROOM_SUCCESS,
	UPDATE_ROOM_RESERVATION,
	DELETE_ROOM_RESERVATION,
} from '../../types/roomTypes.js';

const initialRoomsState = {
	rooms: [],
	room: null,
	loading: null,
	error: null,
	reservation: null,
};

export const roomsReducer = (state = initialRoomsState, action) => {
	switch (action.type) {
		case GET_ROOMS_REQUEST: {
			return {
				...state,
				loading: true,
				error: null,
			};
		}
		case GET_ROOMS_SUCCESS: {
			return {
				...state,
				loading: false,
				rooms: action.payload,
			};
		}
		case GET_ROOM_SUCCESS:
			return { ...state, room: action.payload };
		case GET_ROOMS_FAILURE: {
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		}
		case UPDATE_ROOM_RESERVATION: {
			const { roomId, userId } = action.payload;

			return {
				...state,
				rooms: state.rooms.map((room) =>
					room.id === roomId ? { ...room, reservation: userId } : room,
				),
				room:
					state.room && state.room.id === roomId
						? { ...state.room, reservation: userId }
						: state.room,
			};
		}
		case UPDATE_ROOM_SUCCESS:
			return {
				...state,
				room: action.payload,
				rooms: state.rooms.map((room) =>
					room.id === action.payload.id ? action.payload : room,
				),
			};
		case DELETE_ROOM_RESERVATION:
			return {
				...state,
				rooms: state.rooms.map((room) =>
					room.id === action.payload.roomId
						? { ...room, reservation: null }
						: room,
				),
				room:
					state.room && state.room.id === action.payload.roomId
						? { ...state.room, reservation: null }
						: state.room,
			};
		default:
			return state;
	}
};

const initialRoomState = {
	room: null,
};

export const roomReducer = (state = initialRoomState, action) => {
	switch (action.type) {
		case GET_ROOM_SUCCESS: {
			return {
				...state,
				room: action.payload,
			};
		}

		default:
			return state;
	}
};
