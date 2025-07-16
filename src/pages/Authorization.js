import styled from 'styled-components';
import { H2 } from '../components';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Input } from '../components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../components';
import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { Authorizate } from '../operation/authorizate';
import { useDispatch } from 'react-redux';
import { setUser } from '../actions/set-user';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../selectors';
import { ROLE } from '../constants/role';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверный логин. Допускаются только буквы и цифры')
		.min(3, 'Неверный логин. Минимум 3 символов')
		.max(15, 'Неверный логин. Масимум 15 символов'),

	password: yup
		.string()
		.required('Заполните пароль')
		.matches(/^[\w#%]+$/, 'Неверный пароль. Недоступные символы')
		.min(6, 'Неверный пароль. Минимум 6 символов')
		.max(25, 'Неверный пароль. Масимум 25 символов'),
});

const AuthorizationContainer = ({ className }) => {
	const dispatch = useDispatch();

	const [ServerError, setServerError] = useState(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});
	const formError = errors?.login?.message || errors?.password?.message;
	const errorMessage = formError;
	const roleId = useSelector(selectUserRole);
	if (roleId !== ROLE.READER) {
		return <Navigate to="/" />;
	}
	const onSubmit = ({ login, password }) => {
		Authorizate(login, password).then(({ error, res }) => {
			if (error) {
				setServerError(`Ошибка запроса ${error}`);
				return;
			}
			dispatch(setUser(res));
		});
	};

	return (
		<div className={className}>
			<H2>Авторизация</H2>
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
				<Button type="submit">Авторизоваться</Button>
			</form>
			{errorMessage && <div>{errorMessage}</div>}
			{ServerError && <div style={{ color: 'red' }}>{ServerError}</div>}
			<div>
				<span>Еще нет аккаунта? </span>
				<Link to="/registration">Зарегистрируйтесь!</Link>
			</div>
		</div>
	);
};
export const Authorization = styled(AuthorizationContainer)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	& > form {
		display: flex;
		flex-direction: column;
		gap: 10px 0;
	}
`;
