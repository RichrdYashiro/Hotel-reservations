import psStoreService from '../services/psStoreService';
import {
	getGamesRequest,
	getGamesSuccess,
	getGamesFailure,
	getGameSuccess,
	searchGamesSuccess,
	getDiscountedGamesSuccess,
} from '../actions/games';

export const fetchGames = (start = 0, size = 20, sort = 'price') => {
	return async (dispatch) => {
		dispatch(getGamesRequest());
		try {
			const data = await psStoreService.getGames(start, size, sort);
			dispatch(getGamesSuccess(data));
		} catch (err) {
			dispatch(getGamesFailure(err.message));
		}
	};
};

export const getGame = (id) => async (dispatch) => {
	try {
		const data = await psStoreService.getGameById(id);
		dispatch(getGameSuccess(data));
	} catch (err) {
		console.error('Ошибка при получении игры:', err);
		throw err;
	}
};

export const searchGames =
	(query, start = 0, size = 20) =>
	async (dispatch) => {
		try {
			const data = await psStoreService.searchGames(query, start, size);
			dispatch(searchGamesSuccess(data));
		} catch (err) {
			console.error('Ошибка при поиске игр:', err);
			throw err;
		}
	};

export const fetchDiscountedGames =
	(start = 0, size = 20) =>
	async (dispatch) => {
		try {
			const data = await psStoreService.getDiscountedGames(start, size);
			dispatch(getDiscountedGamesSuccess(data));
		} catch (err) {
			console.error('Ошибка при получении игр со скидками:', err);
			throw err;
		}
	};

export const fetchTopGames =
	(start = 0, size = 20) =>
	async (dispatch) => {
		try {
			const data = await psStoreService.getTopGames(start, size);
			dispatch(getGamesSuccess(data));
		} catch (err) {
			console.error('Ошибка при получении топ игр:', err);
			throw err;
		}
	};

export const fetchNewReleases =
	(start = 0, size = 20) =>
	async (dispatch) => {
		try {
			const data = await psStoreService.getNewReleases(start, size);
			dispatch(getGamesSuccess(data));
		} catch (err) {
			console.error('Ошибка при получении новых релизов:', err);
			throw err;
		}
	};
