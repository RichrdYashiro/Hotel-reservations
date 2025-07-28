import { Link, useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import styled from 'styled-components';
import { Button, H2 } from '../components';
import { ROLE } from '../constants/role';
import { selectUserId, selectUserRole } from '../selectors';
import { addBooking, deleteBooking } from '../operation/bookingThunks';
import { getRoom } from '../operation/roomThunks';

const RoomDetailsContainer = ({ className }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { room } = useSelector((state) => state.rooms);
	const roleId = useSelector(selectUserRole);
	useEffect(() => {
		dispatch(getRoom(id));
	}, [dispatch, id]);

	const userId = useSelector(selectUserId);
	const bookAddRoom = () => {
		dispatch(addBooking(room.id, userId));
	};

	const bookDeleteRoom = () => {
		dispatch(deleteBooking(room.id));
	};

	return (
		<div className={className}>
			{room && (
				<>
					<img src={room.img} alt={room.title} />
					<div className="roomInner">
						<H2>Забронировать: {room.title}</H2>
						<p>
							Цена за номер: <b>{room.price}$</b>
						</p>
						<p>{room.description}</p>
						{roleId === ROLE.ADMIN && (
							<Button onClick={() => navigate(`/room/${room.id}/edit`)}>
								Редактировать номер
							</Button>
						)}
						{roleId === ROLE.READER ? (
							<Button className="noUser">
								<Link to="/authorization">Забронировать</Link>
							</Button>
						) : room.reservation === userId ? (
							<>
								<span className="booking-status booked-by-user">
									Вы забронировали
								</span>
								<button onClick={bookDeleteRoom}>Отменить</button>
							</>
						) : room.reservation ? (
							<span className="booking-status booked">Забронирован</span>
						) : (
							<Button onClick={bookAddRoom}>Забронировать</Button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export const RoomDetails = styled(RoomDetailsContainer)`
	display: flex;
	gap: 16px;
	margin-top: 40px;
	& img {
		max-width: 400px;
	}
	& .noUser > a {
		text-decoration: none;
		color: #000;
	}
`;
