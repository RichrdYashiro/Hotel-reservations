import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchGames } from '../operation/gameThunks';

const SearchGamesContainer = ({ className }) => {
	const [query, setQuery] = useState('');
	const [showResults, setShowResults] = useState(false);
	const dispatch = useDispatch();
	const { searchResults } = useSelector((state) => state.games);
	const navigate = useNavigate();

	// Debounce функция для автоматического поиска
	const debouncedSearch = useCallback(
		debounce((searchQuery) => {
			if (searchQuery.trim()) {
				dispatch(searchGames(searchQuery.trim()));
				setShowResults(true);
			} else {
				setShowResults(false);
			}
		}, 300), // Уменьшаем задержку для более быстрого отклика
		[dispatch],
	);

	// Автоматический поиск при изменении query
	useEffect(() => {
		debouncedSearch(query);
	}, [query, debouncedSearch]);

	const handleInputChange = (e) => {
		setQuery(e.target.value);
		if (!e.target.value.trim()) {
			setShowResults(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (query.trim()) {
			dispatch(searchGames(query.trim()));
			setShowResults(true);
		}
	};

	const handleGameClick = (gameId) => {
		navigate(`/game/${gameId}`);
		setShowResults(false);
	};

	const handleClickOutside = useCallback((e) => {
		if (!e.target.closest('.search-container') && !e.target.closest('.search-results')) {
			setShowResults(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [handleClickOutside]);

	// Debounce функция
	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	return (
		<div className={className}>
			<div className="search-container">
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Поиск игр..."
						value={query}
						onChange={handleInputChange}
						onFocus={() => query.trim() && setShowResults(true)}
					/>
					<button type="submit">Найти</button>
				</form>
				
				{showResults && searchResults && searchResults.length > 0 && (
					<div className="search-results">
						{searchResults.slice(0, 5).map((game) => (
							<div 
								key={game.id} 
								className="search-result-item"
								onClick={() => handleGameClick(game.id)}
							>
								<img src={game.image} alt={game.title} />
								<div className="search-result-info">
									<h4>{game.title}</h4>
									<div className="search-result-details">
										<span className="platform">{game.platform}</span>
										<span className="price">{game.currentPrice} {game.currency}</span>
										{game.discount > 0 && (
											<span className="discount">-{game.discount}%</span>
										)}
									</div>
								</div>
							</div>
						))}
						{searchResults.length > 5 && (
							<div className="more-results">
								+ Ещё {searchResults.length - 5} результатов
							</div>
						)}
					</div>
				)}
				
				{showResults && query.trim() && (!searchResults || searchResults.length === 0) && (
					<div className="search-results">
						<div className="no-results">Ничего не найдено</div>
					</div>
				)}
			</div>
		</div>
	);
};

export const SearchGames = styled(SearchGamesContainer)`
	margin-bottom: 30px;
	animation: fadeInUp 0.8s ease-out;
	position: relative;
	z-index: 100;

	.search-container {
		position: relative;
		max-width: 600px;
		margin: 0 auto;
	}

	form {
		display: flex;
		gap: 15px;
		width: 100%;
	}

	input {
		flex: 1;
		padding: 15px 20px;
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 25px;
		font-size: 1rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		color: white;
		transition: all 0.3s ease;

		&::placeholder {
			color: rgba(255, 255, 255, 0.6);
		}

		&:focus {
			outline: none;
			border-color: #667eea;
			box-shadow: 0 0 25px rgba(102, 126, 234, 0.4);
			background: rgba(255, 255, 255, 0.15);
		}
	}

	button {
		padding: 15px 30px;
		background: linear-gradient(45deg, #667eea, #764ba2);
		color: white;
		border: none;
		border-radius: 25px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
		letter-spacing: 0.5px;

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
				rgba(255, 255, 255, 0.2),
				transparent
			);
			transition: left 0.5s;
		}

		&:hover::before {
			left: 100%;
		}

		&:hover {
			transform: translateY(-2px);
			box-shadow:
				0 10px 25px rgba(102, 126, 234, 0.4),
				0 0 20px rgba(102, 126, 234, 0.3);
			background: linear-gradient(45deg, #764ba2, #667eea);
		}

		&:active {
			transform: translateY(0);
		}
	}

	.search-results {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: rgba(30, 30, 40, 0.95);
		border-radius: 15px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		margin-top: 10px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		z-index: 10;
		max-height: 400px;
		overflow-y: auto;
		animation: fadeIn 0.2s ease-out;
	}

	.search-result-item {
		display: flex;
		padding: 12px 15px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		transition: background 0.2s ease;

		&:hover {
			background: rgba(102, 126, 234, 0.15);
		}

		img {
			width: 60px;
			height: 60px;
			object-fit: cover;
			border-radius: 8px;
			margin-right: 15px;
		}

		.search-result-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		h4 {
			margin: 0 0 5px 0;
			font-size: 16px;
			color: white;
		}

		.search-result-details {
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 14px;
		}

		.platform {
			color: rgba(255, 255, 255, 0.7);
			background: rgba(255, 255, 255, 0.1);
			padding: 2px 8px;
			border-radius: 12px;
			font-size: 12px;
		}

		.price {
			font-weight: bold;
			color: #667eea;
		}

		.discount {
			background: #ff6b6b;
			color: white;
			padding: 2px 6px;
			border-radius: 10px;
			font-size: 12px;
			font-weight: bold;
		}
	}

	.more-results {
		padding: 12px 15px;
		text-align: center;
		color: rgba(255, 255, 255, 0.7);
		font-size: 14px;
		background: rgba(102, 126, 234, 0.1);
	}

	.no-results {
		padding: 20px;
		text-align: center;
		color: rgba(255, 255, 255, 0.7);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		form {
			flex-direction: column;
			gap: 10px;
		}

		input,
		button {
			width: 100%;
		}
	}
`;
