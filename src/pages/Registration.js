import styled from 'styled-components';
import { H2, Breadcrumbs } from '../components';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Input } from '../components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../components';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Registrate } from '../operation/registrate';
import { setUser } from '../actions/user';
import { ROLE } from '../constants/role';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../selectors';

const regFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверный логин. Допускаются только буквы и цифры')
		.min(3, 'Неверный логин. Минимум 3 символов')
		.max(15, 'Неверный логин. Максимум 15 символов'),

	password: yup
		.string()
		.required('Заполните пароль')
		.matches(/^[\w#%]+$/, 'Неверный пароль. Недоступные символы')
		.min(6, 'Неверный пароль. Минимум 6 символов')
		.max(25, 'Неверный пароль. Максимум 25 символов'),

	checkpassword: yup
		.string()
		.required('Введите повтор пароля')
		.oneOf([yup.ref('password'), null], 'Пароли не совпадают'),
});

const RegistrationContainer = ({ className }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
			checkpassword: '',
		},
		resolver: yupResolver(regFormSchema),
	});
	const formError =
		errors?.login?.message || errors?.password?.message || errors.password;
	const [ServerError, setServerError] = useState(null);
	const errorMessage = formError || ServerError;

	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);
	const onSubmit = ({ login, password }) => {
		Registrate(login, password).then(({ error, res }) => {
			if (error) {
				setServerError(`Ошибка запроса ${error}`);
				return;
			}
			dispatch(setUser(res));
			window.location.href = '/authorization';
		});
	};
	if (roleId !== ROLE.READER) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			<Breadcrumbs />
			<H2>Регистрация</H2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="Логин"
					{...register('login', {
						onChange: () => setServerError(null),
					})}
				/>
				<Input
					type="password"
					placeholder="Пароль"
					{...register('password', {
						onChange: () => setServerError(null),
					})}
				/>
				<Input
					type="password"
					placeholder="Повтор пароля"
					{...register('checkpassword', {
						onChange: () => setServerError(null),
					})}
				/>
				<Button type="submit">Зарегистрироваться</Button>
			</form>

			{errorMessage && <div>{errorMessage}</div>}
			<div>
				<span>Есть аккаунта? </span>
				<Link to="/authorization">Войти</Link>
			</div>
		</div>
	);
};
export const Registration = styled(RegistrationContainer)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	padding: 20px;
	animation: fadeInUp 0.8s ease-out;

	& > form {
		display: flex;
		flex-direction: column;
		gap: 15px;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(15px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 25px;
		padding: 30px;
		min-width: 350px;
		max-width: 400px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 1px;
			background: linear-gradient(90deg, transparent, #667eea, transparent);
		}
	}

	& > div:last-child {
		margin-top: 15px;
		text-align: center;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9rem;

		a {
			color: #667eea;
			text-decoration: none;
			font-weight: 600;
			transition: all 0.3s ease;

			&:hover {
				color: #764ba2;
				text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
			}
		}
	}

	& > div:nth-last-child(2) {
		color: #ff6b6b;
		text-align: center;
		margin-top: 8px;
		font-weight: 500;
		font-size: 0.85rem;
	}

	@media (max-width: 768px) {
		padding: 15px;
		min-height: 100vh;

		& > form {
			min-width: 280px;
			padding: 25px 20px;
			gap: 12px;
		}
	}

	@media (max-height: 600px) {
		min-height: 100vh;
		padding: 10px;

		& > form {
			padding: 20px;
			gap: 10px;
		}

		& > div:last-child {
			margin-top: 10px;
		}
	}
`;
