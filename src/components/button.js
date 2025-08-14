import styled from 'styled-components';

const ButtonContainer = ({ className, children, width, ...props }) => {
	return (
		<button className={className} {...props}>
			{children}
		</button>
	);
};

export const Button = styled(ButtonContainer)`
	width: ${(width = '100%') => width};
	height: 45px;
	border: none;
	border-radius: 25px;
	font-size: 14px;
	font-weight: 600;
	background: linear-gradient(45deg, #667eea, #764ba2);
	color: white;
	padding: 0 20px;
	text-decoration: none;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
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
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
	}

	&.secondary {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(10px);
	}

	&.secondary:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.5);
	}

	&.reserved {
		background: linear-gradient(45deg, #2ed573, #1e90ff);
		cursor: not-allowed;
	}

	&.reserved:hover {
		transform: none;
		box-shadow: none;
	}
`;
