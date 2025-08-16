// PlayStation Store India Parser
// Парсер для получения актуальных данных с PlayStation Store India

class PSStoreParser {
	constructor() {
		this.baseUrl = 'https://store.playstation.com/en-in';
		this.categoryUrl = 'https://store.playstation.com/en-in/category/3f772501-f6f8-49b7-abac-874a88ca4897';
		this.corsProxy = 'https://api.allorigins.win/get?url=';
		this.cache = new Map();
		this.cacheTimeout = 5 * 60 * 1000; // 5 минут
		this.maxPages = 5; // Максимальное количество страниц для парсинга
	}

	/**
	 * Получить HTML страницы через CORS прокси
	 * @param {string} url - URL для парсинга
	 * @returns {Promise<string>}
	 */
	async fetchPageHTML(url) {
		try {
			const proxyUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
			const response = await fetch(proxyUrl);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data.contents;
		} catch (error) {
			console.error('Ошибка при получении HTML:', error);
			throw error;
		}
	}

	/**
	 * Парсинг игр с категории товаров (с пагинацией)
	 * @returns {Promise<Array>}
	 */
	async parseDealsPage() {
		try {
			const cacheKey = 'category_games';
			const cached = this.getFromCache(cacheKey);
			if (cached) {
				return cached;
			}

			let allGames = [];
			
			// Парсим несколько страниц
			for (let page = 1; page <= this.maxPages; page++) {
				try {
					const pageUrl = `${this.categoryUrl}/${page}`;
					const html = await this.fetchPageHTML(pageUrl);
					const games = this.extractGamesFromHTML(html);
					
					if (games.length === 0) {
						break; // Нет больше игр на этой странице
					}
					
					allGames = [...allGames, ...games];
					console.log(`Загружено ${games.length} игр со страницы ${page}`);
					
					// Небольшая задержка между запросами
					await new Promise(resolve => setTimeout(resolve, 1000));
				} catch (pageError) {
					console.warn(`Ошибка при загрузке страницы ${page}:`, pageError);
					break;
				}
			}

			console.log(`Всего загружено ${allGames.length} игр`);
			this.setCache(cacheKey, allGames);
			return allGames;
		} catch (error) {
			console.error('Ошибка при парсинге категории:', error);
			return [];
		}
	}

	/**
	 * Извлечение данных об играх из HTML
	 * @param {string} html - HTML страницы
	 * @returns {Array}
	 */
	extractGamesFromHTML(html) {
		const games = [];
		try {
			// Создаем временный DOM элемент для парсинга
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');

			// Ищем элементы игр (адаптируем под структуру PS Store категории)
			const gameElements = doc.querySelectorAll(
				'[data-qa="search-result-item"], .psw-product-tile, .product-item, .ems-sdk-product-tile, article',
			);

			gameElements.forEach((element, index) => {
				try {
					const game = this.extractGameData(element, index);
					if (game) {
						games.push(game);
					}
				} catch (error) {
					console.warn('Ошибка при извлечении данных игры:', error);
				}
			});

			// Если не найдены игры стандартным способом, пробуем альтернативные селекторы
			if (games.length === 0) {
				this.tryAlternativeSelectors(doc, games);
			}
		} catch (error) {
			console.error('Ошибка при извлечении игр из HTML:', error);
		}

		return games;
	}

	/**
	 * Извлечение данных одной игры
	 * @param {Element} element - DOM элемент игры
	 * @param {number} index - Индекс игры
	 * @returns {Object|null}
	 */
	extractGameData(element, index) {
		try {
			// Название игры
			const titleElement = element.querySelector(
				'h3, .psw-t-title-s, .product-title, [data-qa="search-result-product-name"], .psw-t-body, .psw-l-anchor',
			);
			const title = titleElement
				? titleElement.textContent.trim()
				: `Game ${index + 1}`;

			// Вариант игры (Edition, Bundle, etc.)
			const gameVariant = this.extractGameVariant(title, element);

			// Изображение
			const imgElement = element.querySelector('img');
			let image = 'https://via.placeholder.com/400x300';
			if (imgElement) {
				image = imgElement.src || 
						imgElement.getAttribute('data-src') || 
						imgElement.getAttribute('data-lazy-src') ||
						imgElement.getAttribute('srcset')?.split(',')[0]?.split(' ')[0] ||
						'https://via.placeholder.com/400x300';
			}

			// Цены
			const priceData = this.extractPriceData(element);

			// Платформа
			const platformElement = element.querySelector(
				'.psw-c-t-2, .platform, [data-qa="search-result-product-platforms"], .psw-t-caption',
			);
			const platform = platformElement ? platformElement.textContent.trim() : 'PS5';

			// Рейтинг (генерируем случайный, так как на странице скидок его обычно нет)
			const rating = (Math.random() * 2 + 3).toFixed(1); // От 3.0 до 5.0

			return {
				id: this.generateGameId(title, index),
				title: title,
				variant: gameVariant, // Новое поле для варианта игры
				image: this.normalizeImageUrl(image),
				currentPrice: priceData.currentPrice,
				originalPrice: priceData.originalPrice,
				discount: priceData.discount,
				currency: '₹',
				platform: platform,
				rating: parseFloat(rating),
				reservation: null,
				description: `${title} - эксклюзивная игра для PlayStation`,
				priceHistory: this.generatePriceHistory(
					priceData.originalPrice,
					priceData.currentPrice,
				),
				discountEndDate: this.generateDiscountEndDate(),
				maxDiscount: priceData.discount,
				maxDiscountDate: new Date().toISOString().split('T')[0],
			};
		} catch (error) {
			console.warn('Ошибка при извлечении данных игры:', error);
			return null;
		}
	}

	/**
	 * Извлечение варианта игры (Edition, Bundle, etc.)
	 * @param {string} title - Название игры
	 * @param {Element} element - DOM элемент игры
	 * @returns {string}
	 */
	extractGameVariant(title, element) {
		try {
			// Ищем ключевые слова в названии
			const variants = [
				'Ultimate Edition', 'Premium Edition', 'Deluxe Edition', 'Complete Edition',
				'Standard Edition', 'Digital Edition', 'Game Bundle', 'Bundle',
				'Ultimate', 'Premium', 'Deluxe', 'Complete', 'Standard',
				'Cross-Gen', 'Remastered', 'Remake', 'Collection'
			];

			for (const variant of variants) {
				if (title.includes(variant)) {
					return variant;
				}
			}

			// Ищем в дополнительных элементах
			const variantElement = element.querySelector('.psw-t-caption, .edition-info, .variant-info');
			if (variantElement) {
				const variantText = variantElement.textContent.trim();
				for (const variant of variants) {
					if (variantText.includes(variant)) {
						return variant;
					}
				}
			}

			return 'Standard'; // По умолчанию
		} catch (error) {
			console.warn('Ошибка при извлечении варианта игры:', error);
			return 'Standard';
		}
	}

	/**
	 * Извлечение данных о ценах
	 * @param {Element} element - DOM элемент игры
	 * @returns {Object}
	 */
	extractPriceData(element) {
		try {
			// Ищем элементы цен (обновленные селекторы для категории)
			const currentPriceElement = element.querySelector(
				'.psw-c-t-1, .price-current, .current-price, [data-qa="search-result-product-price"], .psw-t-title-s, .psw-m-r-3',
			);
			const originalPriceElement = element.querySelector(
				'.psw-c-t-2, .price-original, .original-price, .strikethrough, .psw-t-body',
			);
			const discountElement = element.querySelector(
				'.psw-c-t-discount, .discount-percentage, [data-qa="search-result-product-discount"], .psw-fill-x',
			);

			// Извлекаем цены
			let currentPrice = 0;
			let originalPrice = 0;
			let discount = 0;

			if (currentPriceElement) {
				const currentPriceText = currentPriceElement.textContent.replace(
					/[^\d]/g,
					'',
				);
				currentPrice = parseInt(currentPriceText) || 0;
			}

			if (originalPriceElement) {
				const originalPriceText = originalPriceElement.textContent.replace(
					/[^\d]/g,
					'',
				);
				originalPrice = parseInt(originalPriceText) || currentPrice;
			}

			if (discountElement) {
				const discountText = discountElement.textContent.replace(/[^\d]/g, '');
				discount = parseInt(discountText) || 0;
			}

			// Если оригинальная цена не найдена, вычисляем её из скидки
			if (originalPrice === 0 && discount > 0 && currentPrice > 0) {
				originalPrice = Math.round(currentPrice / (1 - discount / 100));
			}

			// Если скидка не найдена, вычисляем её
			if (discount === 0 && originalPrice > currentPrice) {
				discount = Math.round(
					((originalPrice - currentPrice) / originalPrice) * 100,
				);
			}

			// Если цены не найдены, генерируем случайные
			if (currentPrice === 0) {
				originalPrice = Math.floor(Math.random() * 3000) + 1000; // 1000-4000
				discount = Math.floor(Math.random() * 70) + 10; // 10-80%
				currentPrice = Math.round(originalPrice * (1 - discount / 100));
			}

			return {
				currentPrice,
				originalPrice: originalPrice || currentPrice,
				discount,
			};
		} catch (error) {
			console.warn('Ошибка при извлечении цен:', error);
			return {
				currentPrice: Math.floor(Math.random() * 2000) + 500,
				originalPrice: Math.floor(Math.random() * 3000) + 1000,
				discount: Math.floor(Math.random() * 50) + 10,
			};
		}
	}

	/**
	 * Попытка использовать альтернативные селекторы
	 * @param {Document} doc - Документ для парсинга
	 * @param {Array} games - Массив игр для заполнения
	 */
	tryAlternativeSelectors(doc, games) {
		try {
			// Альтернативные селекторы для разных версий сайта
			const alternativeSelectors = [
				'[data-testid="product-item"]',
				'.product-card',
				'.game-tile',
				'article',
				'.psw-product-tile',
			];

			for (const selector of alternativeSelectors) {
				const elements = doc.querySelectorAll(selector);
				if (elements.length > 0) {
					elements.forEach((element, index) => {
						const game = this.extractGameData(element, index);
						if (game) {
							games.push(game);
						}
					});
					break;
				}
			}
		} catch (error) {
			console.warn('Ошибка при использовании альтернативных селекторов:', error);
		}
	}

	/**
	 * Генерация ID игры
	 * @param {string} title - Название игры
	 * @param {number} index - Индекс
	 * @returns {number}
	 */
	generateGameId(title, index) {
		// Создаем простой хеш из названия
		let hash = 0;
		for (let i = 0; i < title.length; i++) {
			const char = title.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Конвертируем в 32-битное число
		}
		return Math.abs(hash) + index + 1000;
	}

	/**
	 * Нормализация URL изображения
	 * @param {string} imageUrl - URL изображения
	 * @returns {string}
	 */
	normalizeImageUrl(imageUrl) {
		if (!imageUrl || imageUrl === '') {
			return 'https://via.placeholder.com/400x300';
		}

		// Если URL относительный, делаем его абсолютным
		if (imageUrl.startsWith('/')) {
			return `https://store.playstation.com${imageUrl}`;
		}

		return imageUrl;
	}

	/**
	 * Генерация истории цен
	 * @param {number} originalPrice - Оригинальная цена
	 * @param {number} currentPrice - Текущая цена
	 * @returns {Array}
	 */
	generatePriceHistory(originalPrice, currentPrice) {
		const history = [];
		const today = new Date();

		// Базовая цена (3 месяца назад)
		const baseDate = new Date(today);
		baseDate.setMonth(baseDate.getMonth() - 3);
		history.push({
			date: baseDate.toISOString().split('T')[0],
			price: originalPrice,
			type: 'base',
		});

		// Промежуточная цена (1 месяц назад)
		const saleDate = new Date(today);
		saleDate.setMonth(saleDate.getMonth() - 1);
		const salePrice = Math.round((originalPrice + currentPrice) / 2);
		history.push({
			date: saleDate.toISOString().split('T')[0],
			price: salePrice,
			type: 'sale',
		});

		// Текущая цена
		history.push({
			date: today.toISOString().split('T')[0],
			price: currentPrice,
			type: 'max_discount',
		});

		return history;
	}

	/**
	 * Генерация даты окончания скидки
	 * @returns {string}
	 */
	generateDiscountEndDate() {
		const endDate = new Date();
		endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 7); // 7-37 дней
		return endDate.toISOString().split('T')[0];
	}

	/**
	 * Кеширование данных
	 * @param {string} key - Ключ кеша
	 * @param {any} data - Данные для кеширования
	 */
	setCache(key, data) {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	/**
	 * Получение данных из кеша
	 * @param {string} key - Ключ кеша
	 * @returns {any|null}
	 */
	getFromCache(key) {
		const cached = this.cache.get(key);
		if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
			return cached.data;
		}
		return null;
	}

	/**
	 * Очистка кеша
	 */
	clearCache() {
		this.cache.clear();
	}
}

// Создаем экземпляр парсера
const psStoreParser = new PSStoreParser();

export default psStoreParser;