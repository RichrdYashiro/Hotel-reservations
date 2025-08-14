import styled from 'styled-components';
const h2Container = ({ className, children }) => {
	return <h2 className={className}>{children}</h2>;
};

export const H2 = styled(h2Container)`
	text-align: center;
	margin: 20px auto;
	font-size: 2.2rem;
	font-weight: 800;
	background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	position: relative;

	&::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%);
		width: 80px;
		height: 3px;
		background: linear-gradient(90deg, #667eea, #764ba2);
		border-radius: 2px;
	}

	@media (max-width: 768px) {
		font-size: 1.8rem;
		margin: 15px auto;
	}

	@media (max-height: 600px) {
		font-size: 1.6rem;
		margin: 10px auto;

		&::after {
			bottom: -6px;
			width: 60px;
			height: 2px;
		}
	}
`;
