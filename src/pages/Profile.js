import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { H2, Breadcrumbs } from '../components';
import { GameItem } from '../components/gameItem';
import { RoomItem } from '../components/roomItem';
import { fetchGames } from '../operation/gameThunks';
import { fetchUserBookings } from '../operation/userBookingsThunks';
import { selectUserId } from '../selectors';

const ProfileContainer = ({ className }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	const { games, loading, error } = useSelector((state) => state.games);
	const { userBookings } = useSelector((state) => state.booking);
	const { rooms } = useSelector((state) => state.rooms);

	useEffect(() => {
		dispatch(fetchGames(0, 50, 'price'));
		if (userId) {
			dispatch(fetchUserBookings(userId));
		}
	}, [dispatch, userId]);

	if (loading) return <div className="loading-container">Загружаем ваш профиль...</div>;
	if (error) return <div className="error-container">Ошибка: {error}</div>;
	if (!userId) {
		navigate('/authorization');
		return null;
	}

	// Получаем забронированные игры пользователя
	const userGames = games.filter((game) => game.reservation === userId);

	// Получаем забронированные комнаты пользователя
	const userRooms = rooms.filter((room) => room.reservation === userId);

	// Вычисляем общую стоимость игр
	const gamesCost = userGames.reduce((sum, game) => sum + game.currentPrice, 0);
	
	// Вычисляем общую стоимость комнат
	const roomsCost = userRooms.reduce((sum, room) => sum + parseFloat(room.price || 0), 0);
	
	// Общая стоимость
	const totalCost = gamesCost + roomsCost;

	// Функция для форматирования даты
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	// Функция для получения дней до окончания скидки
	const getDaysUntilDiscountEnd = (endDate) => {
		if (!endDate) return null;
		const end = new Date(endDate);
		const now = new Date();
		const diffTime = end - now;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	// Функция для получения базовой цены
	const getBasePrice = (game) => {
		const basePrice = game.priceHistory?.find((h) => h.type === 'base');
		return basePrice ? basePrice.price : game.originalPrice;
	};

	return (
		<div className={className}>
			<Breadcrumbs />

			<H2>Личный кабинет</H2>

			<div className="profile-summary">
				<div className="summary-card">
					<h3>Общая стоимость</h3>
					<div className="total-cost">
						{totalCost > 1000 ? (
							<>
								<span className="cost-amount">
									Стоимость {totalCost} рупий
								</span>
							</>
						) : (
							<>
								<span className="cost-amount">{totalCost} ₹</span>
							</>
						)}

			{userRooms.length > 0 ? (
				<>
					<H2>Ваши забронированные комнаты</H2>
					<div className="rooms-grid">
						{userRooms.map((room) => (
							<RoomItem key={room.id} data-reservat={room.reservation}>
								<h3>{room.title}</h3>
								<img src={room.img} alt={room.title} />
								<p>Цена: {room.price}$</p>
								<button
									onClick={() => navigate(`/room/${room.id}`)}
									className="view-details-button"
								>
									Просмотреть детали
								</button>
							</RoomItem>
						))}
					</div>
				</>
			) : (
				<div className="empty-state">
					<h3>У вас пока нет забронированных комнат</h3>
					<p>
						Перейдите в каталог комнат, чтобы забронировать интересующие вас комнаты
					</p>
					<button className="browse-button" onClick={() => navigate('/')}>
						Перейти к комнатам
					</button>
				</div>
			)}
					</div>
				</div>

				<div className="summary-card">
					<h3>Забронировано игр</h3>
					<div className="games-count">{userGames.length}</div>
				</div>
				
				<div className="summary-card">
					<h3>Забронировано комнат</h3>
					<div className="rooms-count">{userRooms.length}</div>
				</div>
			</div>

			{userGames.length > 0 ? (
				<>
					<H2>Ваши забронированные игры</H2>
					<div className="games-grid">
						{userGames.map((game) => {
							const daysUntilEnd = getDaysUntilDiscountEnd(
								game.discountEndDate,
							);

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
										{game.maxDiscount > 0 && (
											<span>
												{' '}
												• Макс. скидка: {game.maxDiscount}%
											</span>
										)}
									</div>
									{game.discountEndDate && (
										<div className="discount-info">
											Скидка до: {formatDate(game.discountEndDate)}
											{daysUntilEnd !== null &&
												daysUntilEnd > 0 && (
													<span className="days-left">
														• Осталось дней: {daysUntilEnd}
													</span>
												)}
										</div>
									)}
									<button
										className="remove-button"
										onClick={() => {
											// Здесь будет логика удаления брони
											console.log(
												'Удалить бронь для игры:',
												game.id,
											);
										}}
									>
										Удалить из брони
									</button>
								</GameItem>
							);
						})}
					</div>
				</>
			) : (
				<div className="empty-state">
					<h3>У вас пока нет забронированных игр</h3>
					<p>
						Перейдите в каталог игр, чтобы забронировать интересующие вас игры
					</p>
					<button className="browse-button" onClick={() => navigate('/')}>
						Перейти к играм
					</button>
				</div>
			)}
		</div>
	);
};

export const Profile = styled(ProfileContainer)`
	display: flex;
	flex-direction: column;
	max-width: 1400px;
	margin: 0 auto;
	padding: 20px;
	animation: fadeInUp 0.8s ease-out;

	.profile-summary {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 40px;
	}

	.summary-card {
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 20px;
		padding: 25px;
		text-align: center;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
			border-color: rgba(102, 126, 234, 0.3);
		}

		h3 {
			color: rgba(255, 255, 255, 0.8);
			font-size: 1rem;
			font-weight: 600;
			margin-bottom: 15px;
		}

		.total-cost {
			.cost-amount {
				font-size: 1.8rem;
				font-weight: 800;
				background: linear-gradient(45deg, #667eea, #764ba2);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}
		}

		.games-count,
	.rooms-count {
			font-size: 2.5rem;
			font-weight: 800;
			color: #667eea;
			text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
		}
	}

	.games-grid,
	.rooms-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 25px;
		margin-bottom: 40px;
	}

	.remove-button {
		background: linear-gradient(45deg, #ff6b6b, #ee5a24);
		border: none;
		border-radius: 15px;
		padding: 10px 20px;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		width: 100%;
		margin-top: 10px;

		&:hover {
			background: linear-gradient(45deg, #ee5a24, #ff6b6b);
			transform: translateY(-2px);
			box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
		}
	}

	.view-details-button {
		background: linear-gradient(45deg, #667eea, #764ba2);
		border: none;
		border-radius: 15px;
		padding: 10px 20px;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		width: 100%;
		margin-top: 10px;

		&:hover {
			background: linear-gradient(45deg, #764ba2, #667eea);
			transform: translateY(-2px);
			box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
		}
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: rgba(255, 255, 255, 0.7);

		h3 {
			font-size: 1.5rem;
			margin-bottom: 15px;
			color: rgba(255, 255, 255, 0.9);
		}

		p {
			font-size: 1rem;
			margin-bottom: 30px;
			line-height: 1.6;
		}

		.browse-button {
			background: linear-gradient(45deg, #667eea, #764ba2);
			border: none;
			border-radius: 20px;
			padding: 12px 30px;
			color: white;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.3s ease;
			font-size: 1rem;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
			}
		}
	}

	.days-left {
		color: #ff6b6b;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		padding: 15px;

		.profile-summary {
			grid-template-columns: 1fr;
			gap: 15px;
		}

		.summary-card {
			padding: 20px;
		}

		.games-grid,
		.rooms-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.empty-state {
			padding: 40px 15px;
		}
	}
`;
