import styled from 'styled-components';
import { H2 } from '../components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms } from '../operation/roomThunks';
import { RoomItem } from '../components/roomItem';
import { selectUserId, selectUserRole } from '../selectors';
import { ROLE } from '../constants/role';
import { Link } from 'react-router';
import { deleteBooking } from '../operation/bookingThunks';

const ProfileContainer = ({ className }) => {
	const dispatch = useDispatch();
	const userId = useSelector(selectUserId);

	useEffect(() => {
		dispatch(fetchRooms());
	}, [dispatch]);

	const { rooms } = useSelector((state) => state.rooms);

	const filteredRooms = rooms.filter((room) => room.reservation === userId);
	const roleId = useSelector(selectUserRole);
	if (roleId === ROLE.READER) {
		return (
			<div className={className}>
				<H2>Похоже вы забыли авторизироваться</H2>
				<Link to="/authorization">Вернутся на главную</Link>
			</div>
		);
	}
	return (
		<div className={className}>
			<H2>Ваши забронированные номера</H2>
			<div className="rooms-grid">
				{filteredRooms.length > 0 ? (
					filteredRooms.map((room) => (
						<RoomItem key={room.id} data-reserved={room.reservation}>
							<h3>{room.title}</h3>
							<button onClick={() => dispatch(deleteBooking(room.id))}>
								X
							</button>
						</RoomItem>
					))
				) : (
					<p>Вы пока ничего не забронировали.</p>
				)}
			</div>
		</div>
	);
};
export const Profile = styled(ProfileContainer)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;

	& > .rooms-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 20px;
	}
`;
