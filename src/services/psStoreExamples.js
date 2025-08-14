// Примеры использования PS Store Service
import psStoreService from './psStoreService';
import { useState } from 'react';

// Пример 1: Получение списка игр
export const getGamesExample = async () => {
	try {
		const result = await psStoreService.getGames(0, 10, 'price');
		console.log('Список игр:', result);
		return result;
	} catch (error) {
		console.error('Ошибка при получении игр:', error);
	}
};

// Пример 2: Поиск игр
export const searchGamesExample = async (query) => {
	try {
		const result = await psStoreService.searchGames(query, 0, 10);
		console.log(`Результаты поиска для "${query}":`, result);
		return result;
	} catch (error) {
		console.error('Ошибка при поиске игр:', error);
	}
};

// Пример 3: Получение игр со скидками
export const getDiscountedGamesExample = async () => {
	try {
		const result = await psStoreService.getDiscountedGames(0, 10);
		console.log('Игры со скидками:', result);
		return result;
	} catch (error) {
		console.error('Ошибка при получении игр со скидками:', error);
	}
};

// Пример 4: Получение цены конкретной игры
export const getGamePriceExample = async (gameId) => {
	try {
		const result = await psStoreService.getGamePrice(gameId);
		console.log('Цена игры:', result);
		return result;
	} catch (error) {
		console.error('Ошибка при получении цены игры:', error);
	}
};

// Пример 5: Получение детальной информации об игре
export const getGameDetailsExample = async (gameId) => {
	try {
		const result = await psStoreService.getGameById(gameId);
		console.log('Детали игры:', result);
		return result;
	} catch (error) {
		console.error('Ошибка при получении деталей игры:', error);
	}
};

// Пример 6: Получение топ игр
export const getTopGamesExample = async () => {
	try {
		const result = await psStoreService.getTopGames(0, 10);
		console.log('Топ игр:', result);
		return result;
	} catch (error) {
		console.error('Ошибка при получении топ игр:', error);
	}
};

// Пример 7: Получение новых релизов
export const getNewReleasesExample = async () => {
	try {
		const result = await psStoreService.getNewReleases(0, 10);
		console.log('Новые релизы:', result);
		return result;
	} catch (error) {
		console.error('Ошибка при получении новых релизов:', error);
	}
};

// Пример 8: Мониторинг цен (проверка изменения цены)
export const monitorPriceChange = async (gameId, previousPrice) => {
	try {
		const currentPrice = await psStoreService.getGamePrice(gameId);

		if (currentPrice.currentPrice !== previousPrice) {
			const priceChange = previousPrice - currentPrice.currentPrice;
			const changePercent = ((priceChange / previousPrice) * 100).toFixed(2);

			console.log(`Цена изменилась для "${currentPrice.title}":`);
			console.log(`Было: ${previousPrice} ${currentPrice.currency}`);
			console.log(`Стало: ${currentPrice.currentPrice} ${currentPrice.currency}`);
			console.log(
				`Изменение: ${priceChange > 0 ? '+' : ''}${priceChange} ${currentPrice.currency} (${changePercent}%)`,
			);

			return {
				gameId,
				title: currentPrice.title,
				previousPrice,
				currentPrice: currentPrice.currentPrice,
				priceChange,
				changePercent,
				currency: currentPrice.currency,
			};
		}

		return null;
	} catch (error) {
		console.error('Ошибка при мониторинге цены:', error);
	}
};

// Пример 9: Получение лучших скидок
export const getBestDiscounts = async (minDiscountPercent = 50) => {
	try {
		const result = await psStoreService.getDiscountedGames(0, 50);
		const bestDiscounts = result.games.filter(
			(game) => game.discount >= minDiscountPercent,
		);

		console.log(`Игры со скидкой ${minDiscountPercent}% и более:`, bestDiscounts);
		return bestDiscounts;
	} catch (error) {
		console.error('Ошибка при получении лучших скидок:', error);
	}
};

// Пример 10: Сравнение цен игр
export const compareGamePrices = async (gameIds) => {
	try {
		const pricePromises = gameIds.map((id) => psStoreService.getGamePrice(id));
		const prices = await Promise.all(pricePromises);

		const sortedByPrice = prices.sort((a, b) => a.currentPrice - b.currentPrice);

		console.log('Сравнение цен игр (от дешевых к дорогим):', sortedByPrice);
		return sortedByPrice;
	} catch (error) {
		console.error('Ошибка при сравнении цен:', error);
	}
};

// Пример использования в React компоненте
export const usePSStoreData = () => {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchGames = async (start = 0, size = 20, sort = 'price') => {
		setLoading(true);
		setError(null);

		try {
			const result = await psStoreService.getGames(start, size, sort);
			setGames(result.games);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const searchGames = async (query) => {
		setLoading(true);
		setError(null);

		try {
			const result = await psStoreService.searchGames(query);
			setGames(result.games);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return {
		games,
		loading,
		error,
		fetchGames,
		searchGames,
	};
};

// Экспорт всех примеров
export default {
	getGamesExample,
	searchGamesExample,
	getDiscountedGamesExample,
	getGamePriceExample,
	getGameDetailsExample,
	getTopGamesExample,
	getNewReleasesExample,
	monitorPriceChange,
	getBestDiscounts,
	compareGamePrices,
	usePSStoreData,
};
