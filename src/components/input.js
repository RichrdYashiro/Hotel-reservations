import styled from 'styled-components';

const InputContainer = ({ className, children, ...props }) => {
	return <input className={className} {...props}></input>;
};

export const Input = styled(InputContainer)`
	padding: 12px 18px;
	border: 2px solid rgba(255, 255, 255, 0.2);
	border-radius: 20px;
	font-size: 0.95rem;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	color: white;
	transition: all 0.3s ease;
	width: 100%;
	min-width: 280px;

	&::placeholder {
		color: rgba(255, 255, 255, 0.6);
	}

	&:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
		background: rgba(255, 255, 255, 0.15);
	}

	&:hover {
		border-color: rgba(255, 255, 255, 0.4);
		background: rgba(255, 255, 255, 0.12);
	}

	@media (max-width: 768px) {
		min-width: 240px;
		padding: 10px 15px;
		font-size: 0.9rem;
	}

	@media (max-height: 600px) {
		padding: 8px 15px;
		font-size: 0.85rem;
	}
`;
