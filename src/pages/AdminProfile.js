import styled from 'styled-components';
import { H2 } from '../components';
import { ROLE } from '../constants/role';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { useEffect } from 'react';
import { RoomItem } from '../components/roomItem';
import { useDispatch } from 'react-redux';
import { fetchRooms } from '../actions/Room-actions';
import { selectUserRole } from '../selectors';
const AdminProfileContainer = ({ className }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchRooms());
	}, [dispatch]);

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
			<div className="rooms-grid">
				{rooms.map((room) => (
					<RoomItem key={room.id} data-reserved={room.reservation}>
						<h3>{room.title}</h3>
					</RoomItem>
				))}
			</div>
		</div>
	);
};

export const AdminProfile = styled(AdminProfileContainer)`
	display: flex;
	flex-direction: column;
	text-align: center;

	.rooms-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 20px;

		& > [data-reserved='true'] {
			background-color: #ffb731;
			border: 4px solid #ffb731;
			color: #fff;
		}
	}
`;
