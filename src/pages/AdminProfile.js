import styled from 'styled-components';
import { H2 } from '../components';
import { ROLE } from '../constants/role';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RoomItem } from '../components/roomItem';
import { useDispatch } from 'react-redux';
import { selectUserRole } from '../selectors';
import { fetchRooms } from '../operation/roomThunks';
import { ParserControl } from '../components/ParserControl';

const AdminProfileContainer = ({ className }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchRooms());
	}, [dispatch]);
	const [users, setUsers] = useState({});

	useEffect(() => {
		fetch('http://localhost:5000/api/auth/users')
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Ошибка: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				const map = {};
				data.forEach((user) => {
					map[user.id] = user.login;
				});
				setUsers(map);
			})
			.catch((err) => {
				console.error('Ошибка загрузки пользователей:', err);
				setUsers({});
			});
	}, []);

	const { rooms } = useSelector((state) => state.rooms);

	const roleId = useSelector(selectUserRole);
	if (roleId !== ROLE.ADMIN) {
		return (
			<div className={className}>
				<H2>Доступ запрещён</H2>
				<Link to="/">Вернутся на главную</Link>
			</div>
		);
	}

	return (
		<div className={className}>
			<H2>Админ панель</H2>
			
			{/* Управление парсером PlayStation Store */}
			<div className="parser-section">
				<h3>Управление парсером PlayStation Store</h3>
				<ParserControl />
			</div>
			
			{/* Управление комнатами */}
			<div className="rooms-section">
				<h3>Управление комнатами</h3>
				<div className="rooms-grid">
					{rooms.map((room) => (
						<RoomItem key={room.id} data-reserved={room.reservation}>
							<h3>{room.title}</h3>
							{room.reservation && <span>Зарезервирован</span>}
						</RoomItem>
					))}
				</div>
			</div>
		</div>
	);
};

export const AdminProfile = styled(AdminProfileContainer)`
	display: flex;
	flex-direction: column;
	text-align: center;
	gap: 30px;

	.parser-section,
	.rooms-section {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 15px;
		padding: 20px;
		margin: 20px 0;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.parser-section h3,
	.rooms-section h3 {
		color: #fff;
		margin-bottom: 20px;
		font-size: 1.5rem;
	}

	.rooms-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 20px;

		& > [data-reserved] {
			background-color: #ffb731;
			border: 4px solid #ffb731;
			color: #fff;
		}
	}
`;
