import styled from 'styled-components';
import { Button, H2 } from '../components';
import { getGame } from '../operation/gameThunks';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { selectUserId } from '../selectors';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

// Регистрируем компоненты Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const GameDetailsContainer = ({ className }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const userId = useSelector(selectUserId);
	const { game, loading, error } = useSelector((state) => state.games);

	useEffect(() => {
		if (id) {
			dispatch(getGame(id));
		}
	}, [dispatch, id]);

	if (loading) return <p>Загружаем информацию об игре...</p>;
	if (error) return <p>Ошибка: {error}</p>;
	if (!game) return <p>Игра не найдена</p>;

	const isReserved = game.reservation === userId;

	return (
		<div className={className}>
			<div className="game-header">
				<H2>{game.title}</H2>
				<div className="price-section">
					<div className="current-price">
						{game.currentPrice} {game.currency}
					</div>
					{game.originalPrice > game.currentPrice && (
						<div className="original-price">
							{game.originalPrice} {game.currency}
						</div>
					)}
					{game.discount > 0 && (
						<div className="discount-badge">-{game.discount}%</div>
					)}
				</div>
			</div>

			<div className="game-content">
				<div className="game-image">
					<img src={game.image} alt={game.title} />
				</div>

				<div className="game-info">
					<div className="game-details">
						<div className="detail-item">
							<strong>Платформа:</strong> {game.platform}
						</div>
						{game.rating && (
							<div className="detail-item">
								<strong>Рейтинг:</strong>{' '}
								<span className="rating">★ {game.rating}</span>
							</div>
						)}
						{game.genre && (
							<div className="detail-item">
								<strong>Жанр:</strong> {game.genre}
							</div>
						)}
						{game.releaseDate && (
							<div className="detail-item">
								<strong>Дата выхода:</strong>{' '}
								{new Date(game.releaseDate).toLocaleDateString()}
							</div>
						)}
						{game.developer && (
							<div className="detail-item">
								<strong>Разработчик:</strong> {game.developer}
							</div>
						)}
						{game.publisher && (
							<div className="detail-item">
								<strong>Издатель:</strong> {game.publisher}
							</div>
						)}
						{game.language && (
							<div className="detail-item">
								<strong>Язык:</strong> {game.language}
							</div>
						)}
						{game.size && (
							<div className="detail-item">
								<strong>Размер:</strong> {game.size}
							</div>
						)}
						{game.players && (
							<div className="detail-item">
								<strong>Игроки:</strong> {game.players}
							</div>
						)}
					</div>

					{game.description && (
						<div className="description">
							<h3>Описание</h3>
							<p>{game.description}</p>
						</div>
					)}

					{game.priceHistory && game.priceHistory.length > 0 && (
						<div className="price-history-chart">
							<h3>История цен</h3>
							<div className="chart-container">
								<Line
									data={{
										labels: game.priceHistory.map(item => {
											const date = new Date(item.date);
											return date.toLocaleDateString('ru-RU');
										}),
										datasets: [
											{
												label: 'Цена',
												data: game.priceHistory.map(item => item.price),
												borderColor: 'rgba(102, 126, 234, 1)',
												backgroundColor: 'rgba(102, 126, 234, 0.2)',
												borderWidth: 2,
												tension: 0.4,
												fill: true,
												pointBackgroundColor: 'rgba(118, 75, 162, 1)',
												pointBorderColor: '#fff',
												pointHoverBackgroundColor: '#fff',
												pointHoverBorderColor: 'rgba(118, 75, 162, 1)',
												pointRadius: 5,
												pointHoverRadius: 7,
											},
										],
									}}
									options={{
										responsive: true,
										maintainAspectRatio: false,
										plugins: {
											legend: {
												position: 'top',
												labels: {
													font: {
														size: 14,
													},
													color: 'rgba(255, 255, 255, 0.8)',
												},
											},
											tooltip: {
												backgroundColor: 'rgba(0, 0, 0, 0.7)',
												titleFont: {
													size: 14,
												},
												bodyFont: {
													size: 14,
												},
												callbacks: {
													label: function(context) {
														return `Цена: ${context.raw} ${game.currency}`;
													},
												},
											},
										},
										scales: {
											x: {
												grid: {
													color: 'rgba(255, 255, 255, 0.1)',
												},
												ticks: {
													color: 'rgba(255, 255, 255, 0.7)',
												},
											},
											y: {
												grid: {
													color: 'rgba(255, 255, 255, 0.1)',
												},
												ticks: {
													color: 'rgba(255, 255, 255, 0.7)',
													callback: function(value) {
														return value + ' ' + game.currency;
													},
												},
											},
										},
									}}
								/>
							</div>
						</div>
					)}

					{game.screenshots && game.screenshots.length > 0 && (
						<div className="screenshots">
							<h3>Скриншоты</h3>
							<div className="screenshots-grid">
								{game.screenshots.map((screenshot, index) => (
									<img
										key={index}
										src={screenshot.url}
										alt={`Скриншот ${index + 1}`}
									/>
								))}
							</div>
						</div>
					)}

					<div className="actions">
						{isReserved ? (
							<Button onClick={() => navigate('/')} className="reserved">
								Забронировано
							</Button>
						) : userId ? (
							<Button onClick={() => navigate('/')}>
								Забронировать игру
							</Button>
						) : (
							<Button onClick={() => navigate('/authorization')} className="auth-button">
								Авторизоваться для бронирования
							</Button>
						)}
						<Button onClick={() => navigate('/')} className="secondary">
							Назад к играм
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const GameDetails = styled(GameDetailsContainer)`
	max-width: 1400px;
	margin: 0 auto;
	padding: 30px;
	animation: fadeInUp 0.8s ease-out;

	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40px;
		padding-bottom: 30px;
		border-bottom: 2px solid rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 30px;

		.price-section {
			display: flex;
			align-items: center;
			gap: 20px;
		}

		.current-price {
			font-size: 2.5rem;
			font-weight: 800;
			background: linear-gradient(45deg, #667eea, #764ba2);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}

		.original-price {
			font-size: 1.4rem;
			color: rgba(255, 255, 255, 0.6);
			text-decoration: line-through;
		}

		.discount-badge {
			background: linear-gradient(45deg, #ff6b6b, #ee5a24);
			color: white;
			padding: 10px 20px;
			border-radius: 25px;
			font-size: 1.1rem;
			font-weight: 700;
			box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
			animation: pulse 2s ease-in-out infinite;
		}
	}

	.game-content {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 50px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 30px;
		}
	}

	.game-image {
		img {
			width: 100%;
			height: auto;
			border-radius: 20px;
			box-shadow:
				0 20px 40px rgba(0, 0, 0, 0.3),
				0 0 30px rgba(102, 126, 234, 0.2);
			transition: all 0.3s ease;
		}

		img:hover {
			transform: scale(1.02);
			box-shadow:
				0 25px 50px rgba(0, 0, 0, 0.4),
				0 0 40px rgba(102, 126, 234, 0.3);
		}
	}

	.game-info {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		padding: 30px;

		.game-details {
			margin-bottom: 40px;

			.detail-item {
				margin-bottom: 15px;
				padding: 12px 0;
				border-bottom: 1px solid rgba(255, 255, 255, 0.1);
				transition: all 0.3s ease;

				&:hover {
					background: rgba(255, 255, 255, 0.05);
					border-radius: 10px;
					padding: 12px 15px;
					margin: 0 -15px 15px -15px;
				}

				strong {
					color: #667eea;
					margin-right: 15px;
					font-weight: 600;
				}

				.rating {
					color: #ffd700;
					font-weight: 700;
					text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
				}
			}
		}

		.description {
			margin-bottom: 40px;

			h3 {
				margin-bottom: 20px;
				color: #ffffff;
				font-size: 1.5rem;
				font-weight: 700;
				background: linear-gradient(45deg, #667eea, #764ba2);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}

			p {
				line-height: 1.8;
				color: rgba(255, 255, 255, 0.8);
				font-size: 1.1rem;
			}
		}

		.screenshots {
			margin-bottom: 40px;

			h3 {
				margin-bottom: 20px;
				color: #ffffff;
				font-size: 1.5rem;
				font-weight: 700;
				background: linear-gradient(45deg, #667eea, #764ba2);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}

			.screenshots-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
				gap: 20px;
			}
		}

		.price-history-chart {
			margin-bottom: 40px;

			h3 {
				margin-bottom: 20px;
				color: #ffffff;
				font-size: 1.5rem;
				font-weight: 700;
				background: linear-gradient(45deg, #667eea, #764ba2);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}

			.chart-container {
				background: rgba(0, 0, 0, 0.2);
				border-radius: 15px;
				padding: 20px;
				height: 300px;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
				border: 1px solid rgba(255, 255, 255, 0.1);
				overflow: hidden;
				transition: all 0.3s ease;

				&:hover {
					box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
					transform: translateY(-5px);
				}

				img {
					width: 100%;
					height: 150px;
					object-fit: cover;
					border-radius: 15px;
					cursor: pointer;
					transition: all 0.3s ease;
					border: 2px solid transparent;

					&:hover {
						transform: scale(1.05);
						border-color: #667eea;
						box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
					}
				}
			}
		}

		.actions {
			display: flex;
			gap: 20px;
			flex-wrap: wrap;

			button {
				padding: 15px 30px;
				border: none;
				border-radius: 25px;
				cursor: pointer;
				font-size: 1rem;
				font-weight: 600;
				transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
				text-transform: uppercase;
				letter-spacing: 0.5px;

				&.reserved {
					background: linear-gradient(45deg, #2ed573, #1e90ff);
					color: white;
					cursor: not-allowed;
				}

				&.secondary {
					background: rgba(255, 255, 255, 0.1);
					border: 1px solid rgba(255, 255, 255, 0.3);
					color: white;
					backdrop-filter: blur(10px);

					&:hover {
						background: rgba(255, 255, 255, 0.2);
						border-color: rgba(255, 255, 255, 0.5);
						transform: translateY(-2px);
					}
				}
			}
		}
	}

	@media (max-width: 768px) {
		padding: 20px;

		.game-header {
			flex-direction: column;
			gap: 20px;
			text-align: center;
		}

		.price-section {
			flex-direction: column;
			gap: 10px;
		}
	}
`;
