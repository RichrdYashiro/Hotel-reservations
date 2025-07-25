import {
	GET_ROOMS_REQUEST,
	GET_ROOMS_SUCCESS,
	GET_ROOMS_FAILURE,
	GET_ROOM_SUCCESS,
	UPDATE_ROOM_SUCCESS,
} from '../types/roomTypes';

export const getRoomsRequest = () => ({
	type: GET_ROOMS_REQUEST,
});

export const getRoomSuccess = (room) => ({
	type: GET_ROOM_SUCCESS,
	payload: room,
});

export const getRoomsSuccess = (rooms) => ({
	type: GET_ROOMS_SUCCESS,
	payload: rooms,
});

export const getRoomsFailure = (error) => ({
	type: GET_ROOMS_FAILURE,
	payload: error,
});

export const updateRoomSuccess = (room) => ({
	type: UPDATE_ROOM_SUCCESS,
	payload: room,
});
