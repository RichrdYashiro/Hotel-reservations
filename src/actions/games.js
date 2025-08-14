import {
	GET_GAMES_REQUEST,
	GET_GAMES_SUCCESS,
	GET_GAMES_FAILURE,
	GET_GAME_SUCCESS,
	SEARCH_GAMES_SUCCESS,
	GET_DISCOUNTED_GAMES_SUCCESS,
	UPDATE_GAME_RESERVATION,
	DELETE_GAME_RESERVATION,
} from '../types/gameTypes';

export const getGamesRequest = () => ({
	type: GET_GAMES_REQUEST,
});

export const getGamesSuccess = (games) => ({
	type: GET_GAMES_SUCCESS,
	payload: games,
});

export const getGamesFailure = (error) => ({
	type: GET_GAMES_FAILURE,
	payload: error,
});

export const getGameSuccess = (game) => ({
	type: GET_GAME_SUCCESS,
	payload: game,
});

export const searchGamesSuccess = (games) => ({
	type: SEARCH_GAMES_SUCCESS,
	payload: games,
});

export const getDiscountedGamesSuccess = (games) => ({
	type: GET_DISCOUNTED_GAMES_SUCCESS,
	payload: games,
});

export const updateGameReservation = (gameId, userId) => ({
	type: UPDATE_GAME_RESERVATION,
	payload: { gameId, userId },
});

export const deleteGameReservation = (gameId) => ({
	type: DELETE_GAME_RESERVATION,
	payload: { gameId },
});
