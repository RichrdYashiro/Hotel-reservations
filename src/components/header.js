import { Link } from 'react-router';
import styled from 'styled-components';
const HeaderContainer = ({ className }) => (
	<header className={className}>
		
			Забронируй номер
		<div>
            <Link to='/authorization'>Вход</Link> / <Link to='/registration'>Регистрация</Link>
        </div>
	</header>
);

export const Header = styled(HeaderContainer)`
	height: 60px;
    padding: 10px 30px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	    border: 4px solid wheat;
    border-radius: 20px;
	top: 0;
	    width: auto;
`;