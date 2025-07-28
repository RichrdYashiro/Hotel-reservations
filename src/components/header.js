import { Link } from 'react-router';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectUserLogin, selectUserRole } from '../selectors';
import { ROLE } from '../constants/role';

const HeaderContainer = ({ className }) => {
	const roleId = useSelector(selectUserRole);
	const login = useSelector(selectUserLogin);
	console.log('roleId:', roleId); // ← смотрим в консоль
	console.log('login:', login);
	return (
		<header className={className}>
			<Link to="/">Забронируй номер</Link>
			{roleId === ROLE.READER ? (
				<div>
					<Link to="/authorization">Вход</Link> /{' '}
					<Link to="/registration">Регистрация</Link>
				</div>
			) : roleId === ROLE.USER ? (
				<div>
					Привет, {login}! <Link to="/profile">Профиль</Link>
				</div>
			) : roleId === ROLE.ADMIN ? (
				<div>
					Администратор: {login} <Link to="/adminprofile">→ В админку</Link>
				</div>
			) : null}
		</header>
	);
};

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
