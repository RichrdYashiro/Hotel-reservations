import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getRoom } from '../actions/Room-actions';
import styled from 'styled-components';
import { Button, H2 } from '../components';
import { ROLE } from '../constants/role';
import { selectUserId, selectUserRole } from '../selectors';
import { addBooking } from '../actions/add-booking';

const RoomDetailsContainer = ({ className }) => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const { room } = useSelector((state) => state.rooms);
	const roleId = useSelector(selectUserRole);
	useEffect(() => {
		dispatch(getRoom(id));
	}, [dispatch, id]);

	const userId = useSelector(selectUserId);

	return (
		<div className={className}>
			{room && (
				<>
					<img src={room.img} alt={room.title} />
					<div className="roomInner">
						<H2>Забронировать: {room.title}</H2>
						<p>{room.description}</p>
						{roleId !== ROLE.READER && (
							<Button onClick={() => dispatch(addBooking(room.id, userId))}>
								Забронировать
							</Button>
						)}
						{roleId === ROLE.READER && (
							<Button className="noUser">
								<Link to="/authorization">Забронировать</Link>
							</Button>
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
