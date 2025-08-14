import styled from 'styled-components';
import { Button, H2, SearchGames, Breadcrumbs } from '../components';
import { fetchGames, fetchDiscountedGames } from '../operation/gameThunks';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { GameItem } from '../components/gameItem';
import { useNavigate } from 'react-router-dom';
import { selectUserId } from '../selectors';

const HomeContainer = ({ className }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	const [activeTab, setActiveTab] = useState('all');

	useEffect(() => {
		dispatch(fetchGames(0, 20, 'price'));
		dispatch(fetchDiscountedGames(0, 20));
	}, [dispatch]);

	const { games, loading, error, searchResults } = useSelector((state) => state.games);
	const { discountedGames } = useSelector((state) => state.games);

	if (loading) return <p>Загружаем игры...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	// Получаем забронированные игры пользователя
	const filteredGames = games.filter((game) => game.reservation === userId);

	// Функция для форматирования даты
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	// Функция для получения базовой цены
	const getBasePrice = (game) => {
		const basePrice = game.priceHistory?.find((h) => h.type === 'base');
		return basePrice ? basePrice.price : game.originalPrice;
	};

	// Функция для получения максимальной скидки
	const getMaxDiscount = (game) => {
		return game.maxDiscount || 0;
	};

	return (
		<div className={className}>
			<Breadcrumbs />
			<SearchGames />

			{userId && filteredGames.length > 0 && (
				<section>
					<H2>Ваши забронированные игры</H2>
					<div className="games-grid">
						{filteredGames.map((game) => {
							return (
								<GameItem key={game.id} data-reservat={game.reservation}>
									<h3>{game.title}</h3>
									<img src={game.image} alt={game.title} />
									<div className="price-info">
										<span className="current-price">
											{game.currentPrice} {game.currency}
										</span>
										{game.discount > 0 && (
											<span className="discount-badge">
												-{game.discount}%
											</span>
										)}
									</div>
									{game.originalPrice > game.currentPrice && (
										<div className="original-price">
											{game.originalPrice} {game.currency}
										</div>
									)}
									<div className="game-details">
										<span className="platform">{game.platform}</span>
										{game.rating && (
											<span className="rating">
												★ {game.rating}
											</span>
										)}
									</div>
									<div className="price-history">
										Базовая цена: {getBasePrice(game)} {game.currency}
										{getMaxDiscount(game) > 0 && (
											<span>
												{' '}
												• Макс. скидка: {getMaxDiscount(game)}%
											</span>
										)}
									</div>
									{game.discountEndDate && (
										<div className="discount-info">
											Скидка до: {formatDate(game.discountEndDate)}
										</div>
									)}
									<Button onClick={() => navigate(`/game/${game.id}`)}>
										Подробнее
									</Button>
								</GameItem>
							);
						})}
					</div>
				</section>
			)}

			<div className="tabs">
				<button
					className={activeTab === 'all' ? 'active' : ''}
					onClick={() => setActiveTab('all')}
				>
					Все игры
				</button>
				<button
					className={activeTab === 'discounted' ? 'active' : ''}
					onClick={() => setActiveTab('discounted')}
				>
					Со скидками
				</button>
				{searchResults.length > 0 && (
					<button
						className={activeTab === 'search' ? 'active' : ''}
						onClick={() => setActiveTab('search')}
					>
						Результаты поиска ({searchResults.length})
					</button>
				)}
			</div>

			{activeTab === 'all' && (
				<>
					<H2>Доступные игры</H2>
					<div className="games-grid">
						{games.map((game) => {
							if (game.reservation === null) {
								return (
									<GameItem
										key={game.id}
										data-reservat={game.reservation}
									>
										<h3>{game.title}</h3>
										<img src={game.image} alt={game.title} />
										<div className="price-info">
											<span className="current-price">
												{game.currentPrice} {game.currency}
											</span>
											{game.discount > 0 && (
												<span className="discount-badge">
													-{game.discount}%
												</span>
											)}
										</div>
										{game.originalPrice > game.currentPrice && (
											<div className="original-price">
												{game.originalPrice} {game.currency}
											</div>
										)}
										<div className="game-details">
											<span className="platform">
												{game.platform}
											</span>
											{game.rating && (
												<span className="rating">
													★ {game.rating}
												</span>
											)}
										</div>
										<div className="price-history">
											Базовая цена: {getBasePrice(game)}{' '}
											{game.currency}
											{getMaxDiscount(game) > 0 && (
												<span>
													{' '}
													• Макс. скидка: {getMaxDiscount(game)}
													%
												</span>
											)}
										</div>
										{game.discountEndDate && (
											<div className="discount-info">
												Скидка до:{' '}
												{formatDate(game.discountEndDate)}
											</div>
										)}
										{userId ? (
											<Button
												onClick={() =>
													navigate(`/game/${game.id}`)
												}
											>
												Забронировать
											</Button>
										) : (
											<Button
												onClick={() => navigate('/authorization')}
												className="auth-button"
											>
												Авторизоваться
											</Button>
										)}
									</GameItem>
								);
							}
							return null;
						})}
					</div>
				</>
			)}

			{activeTab === 'discounted' && (
				<>
					<H2>Игры со скидками</H2>
					<div className="games-grid">
						{discountedGames.map((game) => {
							if (game.reservation === null) {
								return (
									<GameItem
										key={game.id}
										data-reservat={game.reservation}
									>
										<h3>{game.title}</h3>
										<img src={game.image} alt={game.title} />
										<div className="price-info">
											<span className="current-price">
												{game.currentPrice} {game.currency}
											</span>
											{game.discount > 0 && (
												<span className="discount-badge">
													-{game.discount}%
												</span>
											)}
										</div>
										{game.originalPrice > game.currentPrice && (
											<div className="original-price">
												{game.originalPrice} {game.currency}
											</div>
										)}
										<div className="game-details">
											<span className="platform">
												{game.platform}
											</span>
											{game.rating && (
												<span className="rating">
													★ {game.rating}
												</span>
											)}
										</div>
										<div className="price-history">
											Базовая цена: {getBasePrice(game)}{' '}
											{game.currency}
											{getMaxDiscount(game) > 0 && (
												<span>
													{' '}
													• Макс. скидка: {getMaxDiscount(game)}
													%
												</span>
											)}
										</div>
										{game.discountEndDate && (
											<div className="discount-info">
												Скидка до:{' '}
												{formatDate(game.discountEndDate)}
											</div>
										)}
										{userId ? (
											<Button
												onClick={() =>
													navigate(`/game/${game.id}`)
												}
											>
												Забронировать
											</Button>
										) : (
											<Button
												onClick={() => navigate('/authorization')}
												className="auth-button"
											>
												Авторизоваться
											</Button>
										)}
									</GameItem>
								);
							}
							return null;
						})}
					</div>
				</>
			)}

			{activeTab === 'search' && searchResults.length > 0 && (
				<>
					<H2>Результаты поиска</H2>
					<div className="games-grid">
						{searchResults.map((game) => {
							if (game.reservation === null) {
								return (
									<GameItem
										key={game.id}
										data-reservat={game.reservation}
									>
										<h3>{game.title}</h3>
										<img src={game.image} alt={game.title} />
										<div className="price-info">
											<span className="current-price">
												{game.currentPrice} {game.currency}
											</span>
											{game.discount > 0 && (
												<span className="discount-badge">
													-{game.discount}%
												</span>
											)}
										</div>
										{game.originalPrice > game.currentPrice && (
											<div className="original-price">
												{game.originalPrice} {game.currency}
											</div>
										)}
										<div className="game-details">
											<span className="platform">
												{game.platform}
											</span>
											{game.rating && (
												<span className="rating">
													★ {game.rating}
												</span>
											)}
										</div>
										<div className="price-history">
											Базовая цена: {getBasePrice(game)}{' '}
											{game.currency}
											{getMaxDiscount(game) > 0 && (
												<span>
													{' '}
													• Макс. скидка: {getMaxDiscount(game)}
													%
												</span>
											)}
										</div>
										{game.discountEndDate && (
											<div className="discount-info">
												Скидка до:{' '}
												{formatDate(game.discountEndDate)}
											</div>
										)}
										{userId ? (
											<Button
												onClick={() =>
													navigate(`/game/${game.id}`)
												}
											>
												Забронировать
											</Button>
										) : (
											<Button
												onClick={() => navigate('/authorization')}
												className="auth-button"
											>
												Авторизоваться
											</Button>
										)}
									</GameItem>
								);
							}
							return null;
						})}
					</div>
				</>
			)}
		</div>
	);
};
export const Home = styled(HomeContainer)`
	display: flex;
	flex-direction: column;
	max-width: 1400px;
	margin: 0 auto;
	padding: 20px;
	animation: fadeInUp 0.8s ease-out;

	.games-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 25px;
		margin-bottom: 40px;
	}

	.tabs {
		display: flex;
		gap: 15px;
		margin-bottom: 30px;
		justify-content: center;
		flex-wrap: wrap;

		button {
			padding: 12px 25px;
			border: 2px solid rgba(255, 255, 255, 0.15);
			background: rgba(255, 255, 255, 0.08);
			backdrop-filter: blur(10px);
			border-radius: 20px;
			cursor: pointer;
			transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			color: white;
			font-weight: 600;
			font-size: 14px;
			position: relative;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: -100%;
				width: 100%;
				height: 100%;
				background: linear-gradient(
					90deg,
					transparent,
					rgba(255, 255, 255, 0.1),
					transparent
				);
				transition: left 0.5s;
			}

			&:hover::before {
				left: 100%;
			}

			&:hover {
				transform: translateY(-2px);
				background: rgba(255, 255, 255, 0.12);
				border-color: rgba(255, 255, 255, 0.25);
				box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
			}

			&.active {
				background: linear-gradient(45deg, #667eea, #764ba2);
				border-color: #667eea;
				box-shadow:
					0 8px 20px rgba(102, 126, 234, 0.25),
					0 0 15px rgba(102, 126, 234, 0.15);
				transform: translateY(-2px);
			}
		}
	}

	section {
		margin-bottom: 40px;
		animation: fadeInUp 0.6s ease-out;
	}

	.auth-button {
		background: linear-gradient(45deg, #ff6b6b, #ee5a24) !important;
		border-color: #ff6b6b !important;

		&:hover {
			background: linear-gradient(45deg, #ee5a24, #ff6b6b) !important;
			box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3) !important;
		}
	}

	@media (max-width: 768px) {
		padding: 15px;

		.games-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.tabs {
			gap: 10px;

			button {
				padding: 10px 20px;
				font-size: 13px;
			}
		}
	}
`;
