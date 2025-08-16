import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import psStoreService from '../services/psStoreService';

const ParserControlContainer = ({ className }) => {
	const [parserStats, setParserStats] = useState({
		useParser: true,
		cacheSize: 0,
		lastUpdate: null
	});
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateStatus, setUpdateStatus] = useState('');

	useEffect(() => {
		updateStats();
	}, []);

	const updateStats = () => {
		const stats = psStoreService.getParserStats();
		setParserStats(stats);
	};

	const toggleParser = () => {
		const newState = !parserStats.useParser;
		psStoreService.toggleParser(newState);
		setParserStats(prev => ({ ...prev, useParser: newState }));
		setUpdateStatus(`Парсер ${newState ? 'включен' : 'отключен'}`);
		setTimeout(() => setUpdateStatus(''), 3000);
	};

	const forceUpdate = async () => {
		setIsUpdating(true);
		setUpdateStatus('Обновление данных...');
		
		try {
			const games = await psStoreService.forceUpdateFromParser();
			setUpdateStatus(`Успешно обновлено ${games.length} игр`);
			updateStats();
		} catch (error) {
			setUpdateStatus(`Ошибка обновления: ${error.message}`);
		} finally {
			setIsUpdating(false);
			setTimeout(() => setUpdateStatus(''), 5000);
		}
	};

	const formatLastUpdate = (timestamp) => {
		if (!timestamp) return 'Никогда';
		const date = new Date(timestamp);
		return date.toLocaleString('ru-RU');
	};

	return (
		<div className={className}>
			<h3>Управление парсером PlayStation Store</h3>
			
			<div className="parser-status">
				<div className="status-item">
					<span className="status-label">Статус:</span>
					<span className={`status-value ${parserStats.useParser ? 'active' : 'inactive'}`}>
						{parserStats.useParser ? 'Включен' : 'Отключен'}
					</span>
				</div>
				
				<div className="status-item">
					<span className="status-label">Кеш:</span>
					<span className="status-value">{parserStats.cacheSize} записей</span>
				</div>
				
				<div className="status-item">
					<span className="status-label">Последнее обновление:</span>
					<span className="status-value">{formatLastUpdate(parserStats.lastUpdate)}</span>
				</div>
			</div>
			
			<div className="parser-controls">
				<button 
					className={`toggle-btn ${parserStats.useParser ? 'active' : 'inactive'}`}
					onClick={toggleParser}
				>
					{parserStats.useParser ? 'Отключить парсер' : 'Включить парсер'}
				</button>
				
				<button 
					className="update-btn"
					onClick={forceUpdate}
					disabled={isUpdating || !parserStats.useParser}
				>
					{isUpdating ? 'Обновление...' : 'Обновить данные'}
				</button>
			</div>
			
			{updateStatus && (
				<div className={`update-status ${updateStatus.includes('Ошибка') ? 'error' : 'success'}`}>
					{updateStatus}
				</div>
			)}
			
			<div className="parser-info">
				<h4>Информация о парсере</h4>
				<ul>
					<li>Парсер автоматически загружает актуальные данные с PlayStation Store India</li>
					<li>Данные кешируются на 5 минут для оптимизации производительности</li>
					<li>При ошибках парсера автоматически используются локальные данные</li>
					<li>Цены автоматически конвертируются в рубли</li>
				</ul>
			</div>
		</div>
	);
};

const ParserControl = styled(ParserControlContainer)`
	background: rgba(255, 255, 255, 0.05);
	border-radius: 10px;
	padding: 20px;
	color: #fff;

	h3 {
		margin-bottom: 20px;
		color: #fff;
	}

	.parser-status {
		margin-bottom: 20px;
	}

	.status-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		padding: 8px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.status-item:last-child {
		border-bottom: none;
	}

	.status-label {
		color: #ccc;
		font-weight: 500;
	}

	.status-value {
		font-weight: bold;
	}

	.status-value.active {
		color: #4CAF50;
	}

	.status-value.inactive {
		color: #f44336;
	}

	.parser-controls {
		display: flex;
		gap: 15px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.toggle-btn,
	.update-btn {
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.toggle-btn {
		background: #2196F3;
		color: white;
	}

	.toggle-btn.active {
		background: #4CAF50;
	}

	.toggle-btn.inactive {
		background: #f44336;
	}

	.toggle-btn:hover:not(:disabled) {
		opacity: 0.8;
	}

	.update-btn {
		background: #FF9800;
		color: white;
	}

	.update-btn:hover:not(:disabled) {
		background: #F57C00;
	}

	.toggle-btn:disabled,
	.update-btn:disabled {
		background: #666;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.update-status {
		padding: 10px;
		border-radius: 5px;
		margin-bottom: 20px;
		font-weight: bold;
	}

	.update-status.success {
		background: rgba(76, 175, 80, 0.2);
		color: #4CAF50;
		border: 1px solid #4CAF50;
	}

	.update-status.error {
		background: rgba(244, 67, 54, 0.2);
		color: #f44336;
		border: 1px solid #f44336;
	}

	.parser-info {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 5px;
		padding: 15px;
	}

	.parser-info h4 {
		margin-bottom: 10px;
		color: #fff;
	}

	.parser-info ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.parser-info li {
		padding: 5px 0;
		color: #ccc;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.parser-info li:last-child {
		border-bottom: none;
	}

	@media (max-width: 768px) {
		.parser-controls {
			flex-direction: column;
		}

		.toggle-btn,
		.update-btn {
			width: 100%;
		}
	}
`;

export { ParserControl };
export default ParserControl;