import styled from 'styled-components';

const ButtonContainer = ({ className, children, width, ...props }) => {
	return (
		<button className={className} {...props}>
			{children}
		</button>
	);
};

export const Button = styled(ButtonContainer)`
	font-size: 18px;
	width: ${(width = '100%') => width};
	height: 32px;
	border: 4px solid wheat;
	border-radius: 11px;
	height: 30px;
	font-size: 13px;
	background-color: #efd5a6f2;
	padding: 2px 10px;
	text-decoration: none;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	&:hover {
		background-color: #eabb67f2;
		border: 4px solid #eabb67f2;
	}
`;
