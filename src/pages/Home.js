import styled from 'styled-components';
import { Button, H2 } from '../components';
import { fetchRooms } from '../actions/Room-actions';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RoomItem } from '../components/roomItem';
import { useNavigate } from 'react-router-dom';
import { selectUserId } from '../selectors';

const HomeContainer = ({ className }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	useEffect(() => {
		dispatch(fetchRooms());
	}, [dispatch]);
	const { rooms, loading, error } = useSelector((state) => state.rooms);
	if (loading) return <p>Загружаем номера...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	const filteredRooms = rooms.filter((room) => room.reservation === userId);

	return (
		<div className={className}>
			{userId && filteredRooms.length > 0 && (
				<section>
					<H2>Ваши забронированные номера</H2>
					<div className="rooms-grid">
						{filteredRooms.map((room) => {
							return (
								<RoomItem key={room.id} data-reservat={room.reservation}>
									<h3>{room.title}</h3>
									<img src={room.img} alt={room.title} />
									<Button onClick={() => navigate(`/room/${room.id}`)}>
										Подробнее
									</Button>
								</RoomItem>
							);
						})}
					</div>
				</section>
			)}
			<H2>Доступные номера</H2>
			<div className="rooms-grid">
				{rooms.map((room) => {
					if (room.reservation === null) {
						return (
							<RoomItem key={room.id} data-reservat={room.reservation}>
								<h3>{room.title}</h3>
								<img src={room.img} alt={room.title} />
								<Button onClick={() => navigate(`/room/${room.id}`)}>
									Забронировать
								</Button>
							</RoomItem>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
};
export const Home = styled(HomeContainer)`
	display: flex;
	flex-direction: column;

	.rooms-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 20px;
	}
`;
