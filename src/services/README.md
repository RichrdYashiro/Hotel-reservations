# PlayStation Store API Service

Сервис для работы с PlayStation Store API, позволяющий получать информацию об играх, ценах, скидках и других данных.

## Установка и импорт

```javascript
import psStoreService from './services/psStoreService';
```

## Основные методы

### 1. Получение списка игр

```javascript
const result = await psStoreService.getGames(start, size, sort);
```

**Параметры:**

- `start` (number) - Начальная позиция (по умолчанию: 0)
- `size` (number) - Количество игр (по умолчанию: 20)
- `sort` (string) - Сортировка: 'price', 'name', 'release_date', 'popularity' (по умолчанию: 'price')

**Возвращает:**

```javascript
{
  games: [
    {
      id: "game_id",
      title: "Название игры",
      description: "Описание",
      image: "url_изображения",
      currentPrice: 1999,
      originalPrice: 3999,
      discount: 50,
      currency: "RUB",
      platform: "PS4",
      releaseDate: "2023-01-01",
      rating: 4.5,
      genre: "Action"
    }
  ],
  total: 100
}
```

### 2. Поиск игр

```javascript
const result = await psStoreService.searchGames(query, start, size);
```

**Параметры:**

- `query` (string) - Поисковый запрос
- `start` (number) - Начальная позиция (по умолчанию: 0)
- `size` (number) - Количество результатов (по умолчанию: 20)

### 3. Получение игр со скидками

```javascript
const result = await psStoreService.getDiscountedGames(start, size);
```

### 4. Получение информации об игре по ID

```javascript
const game = await psStoreService.getGameById(gameId);
```

**Возвращает детальную информацию:**

```javascript
{
  id: "game_id",
  title: "Название игры",
  description: "Полное описание",
  shortDescription: "Краткое описание",
  image: "url_изображения",
  screenshots: ["url1", "url2", ...],
  currentPrice: 1999,
  originalPrice: 3999,
  discount: 50,
  currency: "RUB",
  platform: "PS4",
  releaseDate: "2023-01-01",
  rating: 4.5,
  genre: "Action",
  developer: "Developer Name",
  publisher: "Publisher Name",
  language: "Russian",
  size: "50 GB",
  players: "1-4"
}
```

### 5. Получение цены игры

```javascript
const price = await psStoreService.getGamePrice(gameId);
```

**Возвращает:**

```javascript
{
  id: "game_id",
  title: "Название игры",
  currentPrice: 1999,
  originalPrice: 3999,
  discount: 50,
  currency: "RUB",
  discountEndDate: "2023-12-31"
}
```

### 6. Получение топ игр

```javascript
const result = await psStoreService.getTopGames(start, size);
```

### 7. Получение новых релизов

```javascript
const result = await psStoreService.getNewReleases(start, size);
```

## Примеры использования

### Базовое использование

```javascript
import psStoreService from './services/psStoreService';

// Получить первые 10 игр
const games = await psStoreService.getGames(0, 10);

// Поиск игр
const searchResults = await psStoreService.searchGames('God of War');

// Получить игры со скидками
const discountedGames = await psStoreService.getDiscountedGames(0, 20);
```

### Мониторинг цен

```javascript
// Проверить изменение цены
const priceChange = await psStoreService.monitorPriceChange(gameId, previousPrice);
if (priceChange) {
	console.log(`Цена изменилась на ${priceChange.changePercent}%`);
}
```

### Получение лучших скидок

```javascript
// Получить игры со скидкой 50% и более
const bestDiscounts = await psStoreService.getBestDiscounts(50);
```

### Сравнение цен

```javascript
// Сравнить цены нескольких игр
const gameIds = ['id1', 'id2', 'id3'];
const priceComparison = await psStoreService.compareGamePrices(gameIds);
```

## Использование в React компонентах

```javascript
import React, { useState, useEffect } from 'react';
import psStoreService from './services/psStoreService';

const GamesList = () => {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchGames = async () => {
			setLoading(true);
			try {
				const result = await psStoreService.getGames(0, 20);
				setGames(result.games);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchGames();
	}, []);

	if (loading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка: {error}</div>;

	return (
		<div>
			{games.map((game) => (
				<div key={game.id}>
					<h3>{game.title}</h3>
					<p>
						Цена: {game.currentPrice} {game.currency}
					</p>
					{game.discount > 0 && <p>Скидка: {game.discount}%</p>}
				</div>
			))}
		</div>
	);
};
```

## Обработка ошибок

Все методы возвращают Promise и могут выбросить ошибку. Рекомендуется использовать try-catch:

```javascript
try {
	const result = await psStoreService.getGames();
	console.log(result);
} catch (error) {
	console.error('Ошибка при получении данных:', error.message);
}
```

## Примечания

1. API может иметь ограничения на количество запросов
2. Некоторые игры могут быть недоступны в определенных регионах
3. Цены могут изменяться в реальном времени
4. Рекомендуется кэшировать данные для улучшения производительности

## Дополнительные возможности

Сервис также поддерживает:

- Фильтрацию по жанрам
- Сортировку по различным параметрам
- Пагинацию для больших списков
- Получение скриншотов игр
- Информацию о разработчиках и издателях
