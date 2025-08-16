import styled from 'styled-components';

const GameItemContainer = ({ className, children, ...props }) => {
	return (
		<div className={className} {...props}>
			{children}
		</div>
	);
};

export const GameItem = styled(GameItemContainer)`
	background: rgba(26, 31, 53, 0.8);
	backdrop-filter: blur(15px);
	border: 1px solid rgba(0, 201, 255, 0.15);
	border-radius: 20px;
	padding: 20px;
	transition: all 0.4s ease;
	position: relative;
	overflow: hidden;
	cursor: pointer;
	box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #00c9ff, #00e676);
		transform: scaleX(0);
		transition: transform 0.4s ease;
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			135deg,
			rgba(0, 201, 255, 0.08),
			rgba(0, 230, 118, 0.08)
		);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	&:hover {
		box-shadow:
			0 15px 30px rgba(0, 0, 0, 0.3),
			0 0 20px rgba(0, 201, 255, 0.2);
		border-color: rgba(0, 201, 255, 0.4);
		background: rgba(26, 31, 53, 0.9);
	}

	&:hover::before {
		transform: scaleX(1);
	}

	&:hover::after {
		opacity: 1;
	}

	h3 {
		margin: 0 0 15px 0;
		font-size: 1.1rem;
		font-weight: 700;
		color: #ffffff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		position: relative;
		z-index: 1;
		line-height: 1.3;
	}

	img {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 15px;
		margin-bottom: 15px;
		transition: all 0.3s ease;
		position: relative;
		z-index: 1;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
		border: 2px solid transparent;
	}

	&:hover img {
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
	}

	.price-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		position: relative;
		z-index: 1;
	}

	.current-price {
		font-size: 1.3rem;
		font-weight: 800;
		background: linear-gradient(45deg, #00c9ff, #00e676);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.original-price {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.5);
		text-decoration: line-through;
		font-weight: 500;
	}

	.discount-badge {
		background: linear-gradient(45deg, #ff6b6b, #ff9f43);
		color: white;
		padding: 4px 12px;
		border-radius: 15px;
		font-size: 0.75rem;
		font-weight: 700;
		box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
	}

	.game-details {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 15px;
		position: relative;
		z-index: 1;
	}

	.platform {
		background: linear-gradient(
			45deg,
			rgba(0, 201, 255, 0.15),
			rgba(0, 230, 118, 0.15)
		);
		border: 1px solid rgba(0, 201, 255, 0.3);
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 0.75rem;
		color: #00c9ff;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.rating {
		color: #ffd700;
		font-weight: 700;
		text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 3px;
	}

	.price-history {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 12px;
		position: relative;
		z-index: 1;
		line-height: 1.4;
	}

	.discount-info {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 10px;
		position: relative;
		z-index: 1;
	}

	.reserved {
		opacity: 0.8;
		position: relative;

		&::after {
			content: 'Забронировано';
			position: absolute;
			top: 15px;
			right: 15px;
			background: linear-gradient(45deg, #2ed573, #1e90ff);
			color: white;
			padding: 6px 12px;
			border-radius: 15px;
			font-size: 0.75rem;
			font-weight: 700;
			box-shadow: 0 4px 12px rgba(46, 213, 115, 0.3);
			z-index: 2;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}
	}

	/* Анимация появления */
	animation: fadeInUp 0.6s ease-out;

	@media (max-width: 768px) {
		padding: 15px;

		h3 {
			font-size: 1rem;
		}

		img {
			height: 180px;
		}

		.current-price {
			font-size: 1.2rem;
		}
	}
`;
