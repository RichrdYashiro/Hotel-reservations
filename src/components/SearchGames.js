import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { searchGames } from '../operation/gameThunks';

const SearchGamesContainer = ({ className }) => {
	const [query, setQuery] = useState('');
	const dispatch = useDispatch();

	// Debounce функция для автоматического поиска
	const debouncedSearch = useCallback(
		debounce((searchQuery) => {
			if (searchQuery.trim()) {
				dispatch(searchGames(searchQuery.trim()));
			}
		}, 500),
		[dispatch],
	);

	// Автоматический поиск при изменении query
	useEffect(() => {
		debouncedSearch(query);
	}, [query, debouncedSearch]);

	const handleInputChange = (e) => {
		setQuery(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (query.trim()) {
			dispatch(searchGames(query.trim()));
		}
	};

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
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Поиск игр..."
					value={query}
					onChange={handleInputChange}
				/>
				<button type="submit">Найти</button>
			</form>
		</div>
	);
};

export const SearchGames = styled(SearchGamesContainer)`
	margin-bottom: 30px;
	animation: fadeInUp 0.8s ease-out;

	form {
		display: flex;
		gap: 15px;
		max-width: 600px;
		margin: 0 auto;
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
