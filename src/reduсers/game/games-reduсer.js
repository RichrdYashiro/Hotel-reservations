import {
	GET_GAMES_REQUEST,
	GET_GAMES_SUCCESS,
	GET_GAMES_FAILURE,
	GET_GAME_SUCCESS,
	SEARCH_GAMES_SUCCESS,
	GET_DISCOUNTED_GAMES_SUCCESS,
	UPDATE_GAME_RESERVATION,
	DELETE_GAME_RESERVATION,
} from '../../types/gameTypes';

const initialGamesState = {
	games: [],
	game: null,
	loading: false,
	error: null,
	searchResults: [],
	discountedGames: [],
};

export const gamesReducer = (state = initialGamesState, action) => {
	switch (action.type) {
		case GET_GAMES_REQUEST: {
			return {
				...state,
				loading: true,
				error: null,
			};
		}
		case GET_GAMES_SUCCESS: {
			return {
				...state,
				loading: false,
				games: action.payload.games || action.payload,
			};
		}
		case GET_GAME_SUCCESS: {
			return {
				...state,
				game: action.payload,
			};
		}
		case GET_GAMES_FAILURE: {
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		}
		case SEARCH_GAMES_SUCCESS: {
			return {
				...state,
				searchResults: action.payload.games || action.payload,
			};
		}
		case GET_DISCOUNTED_GAMES_SUCCESS: {
			return {
				...state,
				discountedGames: action.payload.games || action.payload,
			};
		}
		case UPDATE_GAME_RESERVATION: {
			const { gameId, userId } = action.payload;

			return {
				...state,
				games: state.games.map((game) =>
					game.id === gameId ? { ...game, reservation: userId } : game,
				),
				game:
					state.game && state.game.id === gameId
						? { ...state.game, reservation: userId }
						: state.game,
				searchResults: state.searchResults.map((game) =>
					game.id === gameId ? { ...game, reservation: userId } : game,
				),
				discountedGames: state.discountedGames.map((game) =>
					game.id === gameId ? { ...game, reservation: userId } : game,
				),
			};
		}
		case DELETE_GAME_RESERVATION: {
			const { gameId } = action.payload;

			return {
				...state,
				games: state.games.map((game) =>
					game.id === gameId ? { ...game, reservation: null } : game,
				),
				game:
					state.game && state.game.id === gameId
						? { ...state.game, reservation: null }
						: state.game,
				searchResults: state.searchResults.map((game) =>
					game.id === gameId ? { ...game, reservation: null } : game,
				),
				discountedGames: state.discountedGames.map((game) =>
					game.id === gameId ? { ...game, reservation: null } : game,
				),
			};
		}
		default:
			return state;
	}
};
