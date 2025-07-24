import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { editRoom, getRoom } from '../actions/Room-actions';
import styled from 'styled-components';
import { H2 } from '../components';
import { ROLE } from '../constants/role';
import { selectUserRole } from '../selectors';
import { Input } from '../components/input';

const RoomEditContainer = ({ className }) => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const { room } = useSelector((state) => state.rooms);
	const roleId = useSelector(selectUserRole);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getRoom(id));
	}, [dispatch, id]);

	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (room) {
			setTitle(room.title);
			setDescription(room.description);
			setPrice(room.price);
		}
	}, [room]);

	const onSubmit = () => {
		dispatch(editRoom(id, { title, description, price })).then(({ error, res }) => {
			if (error) {
				alert(`Ошибка при сохранении: ${error}`);
				return;
			}
			navigate(`/room/${id}`);
		});
	};
	if (roleId !== ROLE.ADMIN) {
		return (
			<div className={className}>
				<H2>Доступ запрещён</H2>
				<Link to="/">Вернутся на главную</Link>
			</div>
		);
	}
	return (
		<>
			<H2>Редактирование {title}</H2>
			<form method="post" className={className}>
				{room && (
					<>
						<img src={room.img} alt={room.title} />
						<div className="roomInner">
							Редактировать заголовок:
							<Input
								name="title"
								type="text"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
							></Input>
							Редактировать описание:
							<Input
								name="description"
								type="text"
								value={description}
								onChange={(event) => setDescription(event.target.value)}
							></Input>
							<Input
								name="price"
								type="number"
								value={price}
								onChange={(event) => setPrice(event.target.value)}
							></Input>
						</div>
					</>
				)}
			</form>
			<button
				type="button"
				className="btn btn-success"
				onClick={onSubmit}
				id="add_mod"
			>
				Сохранить
			</button>
		</>
	);
};

export const RoomEdit = styled(RoomEditContainer)`
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
	& .roomInner {
		display: flex;
		flex-direction: column;
	}
`;
