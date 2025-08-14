// PlayStation Store API Service с загрузкой из JSON файла
class PSStoreService {
	constructor() {
		this.baseUrl = '/data/games.json';
		this.headers = {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		};
		this.gamesCache = null;
	}

	/**
	 * Загрузить игры из JSON файла
	 * @returns {Promise<Array>}
	 */
	async loadGamesFromJSON() {
		if (this.gamesCache) {
			return this.gamesCache;
		}

		try {
			const response = await fetch(this.baseUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const games = await response.json();
			this.gamesCache = games;
			return games;
		} catch (error) {
			console.error('Ошибка при загрузке игр из JSON:', error);
			// Возвращаем пустой массив в случае ошибки
			return [];
		}
	}

	/**
	 * Получить список игр с пагинацией
	 * @param {number} start - Начальная позиция
	 * @param {number} size - Количество игр для получения
	 * @param {string} sort - Сортировка (price, name, release_date)
	 * @returns {Promise<Object>}
	 */
	async getGames(start = 0, size = 20, sort = 'price') {
		try {
			// Имитируем задержку сети
			await new Promise((resolve) => setTimeout(resolve, 300));

			const games = await this.loadGamesFromJSON();
			let sortedGames = [...games];

			// Сортировка
			switch (sort) {
				case 'price':
					sortedGames.sort((a, b) => a.currentPrice - b.currentPrice);
					break;
				case 'name':
					sortedGames.sort((a, b) => a.title.localeCompare(b.title));
					break;
				case 'rating':
					sortedGames.sort((a, b) => b.rating - a.rating);
					break;
				case 'discount':
					sortedGames.sort((a, b) => b.discount - a.discount);
					break;
				default:
					break;
			}

			const paginatedGames = sortedGames.slice(start, start + size);

			return {
				games: paginatedGames,
				total: games.length,
			};
		} catch (error) {
			console.error('Ошибка при получении игр:', error);
			throw error;
		}
	}

	/**
	 * Получить информацию об игре по ID
	 * @param {string} gameId - ID игры
	 * @returns {Promise<Object>}
	 */
	async getGameById(gameId) {
		try {
			await new Promise((resolve) => setTimeout(resolve, 200));

			const games = await this.loadGamesFromJSON();
			const game = games.find((g) => g.id.toString() === gameId.toString());
			if (!game) {
				throw new Error('Игра не найдена');
			}

			return game;
		} catch (error) {
			console.error('Ошибка при получении информации об игре:', error);
			throw error;
		}
	}

	/**
	 * Поиск игр по названию
	 * @param {string} query - Поисковый запрос
	 * @param {number} start - Начальная позиция
	 * @param {number} size - Количество результатов
	 * @returns {Promise<Object>}
	 */
	async searchGames(query, start = 0, size = 20) {
		try {
			await new Promise((resolve) => setTimeout(resolve, 200));

			const games = await this.loadGamesFromJSON();
			const filteredGames = games.filter(
				(game) =>
					game.title.toLowerCase().includes(query.toLowerCase()) ||
					game.description.toLowerCase().includes(query.toLowerCase()) ||
					game.platform.toLowerCase().includes(query.toLowerCase()),
			);

			const paginatedGames = filteredGames.slice(start, start + size);

			return {
				games: paginatedGames,
				total: filteredGames.length,
			};
		} catch (error) {
			console.error('Ошибка при поиске игр:', error);
			throw error;
		}
	}

	/**
	 * Получить игры со скидками
	 * @param {number} start - Начальная позиция
	 * @param {number} size - Количество игр
	 * @returns {Promise<Object>}
	 */
	async getDiscountedGames(start = 0, size = 20) {
		try {
			await new Promise((resolve) => setTimeout(resolve, 200));

			const games = await this.loadGamesFromJSON();
			const discountedGames = games
				.filter((game) => game.discount > 0)
				.sort((a, b) => b.discount - a.discount);

			const paginatedGames = discountedGames.slice(start, start + size);

			return {
				games: paginatedGames,
				total: discountedGames.length,
			};
		} catch (error) {
			console.error('Ошибка при получении игр со скидками:', error);
			throw error;
		}
	}

	/**
	 * Получить цену игры
	 * @param {string} gameId - ID игры
	 * @returns {Promise<Object>}
	 */
	async getGamePrice(gameId) {
		try {
			const gameData = await this.getGameById(gameId);
			return {
				id: gameId,
				title: gameData.title,
				currentPrice: gameData.currentPrice,
				originalPrice: gameData.originalPrice,
				discount: gameData.discount,
				currency: gameData.currency,
				discountEndDate: '2024-12-31',
			};
		} catch (error) {
			console.error('Ошибка при получении цены игры:', error);
			throw error;
		}
	}

	/**
	 * Получить топ игр по популярности
	 * @param {number} start - Начальная позиция
	 * @param {number} size - Количество игр
	 * @returns {Promise<Object>}
	 */
	async getTopGames(start = 0, size = 20) {
		try {
			await new Promise((resolve) => setTimeout(resolve, 200));

			const games = await this.loadGamesFromJSON();
			const topGames = [...games].sort((a, b) => b.rating - a.rating);
			const paginatedGames = topGames.slice(start, start + size);

			return {
				games: paginatedGames,
				total: games.length,
			};
		} catch (error) {
			console.error('Ошибка при получении топ игр:', error);
			throw error;
		}
	}

	/**
	 * Получить новые релизы
	 * @param {number} start - Начальная позиция
	 * @param {number} size - Количество игр
	 * @returns {Promise<Object>}
	 */
	async getNewReleases(start = 0, size = 20) {
		try {
			await new Promise((resolve) => setTimeout(resolve, 200));

			const games = await this.loadGamesFromJSON();
			// Для демонстрации просто возвращаем первые игры
			const newReleases = games.slice(0, size);
			const paginatedGames = newReleases.slice(start, start + size);

			return {
				games: paginatedGames,
				total: games.length,
			};
		} catch (error) {
			console.error('Ошибка при получении новых релизов:', error);
			throw error;
		}
	}
}

// Создаем экземпляр сервиса
const psStoreService = new PSStoreService();

export default psStoreService;
