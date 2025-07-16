import styled from 'styled-components';
import { H2 } from '../components';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Input } from '../components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../components';
import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { Registrate } from '../operation/registrate';
import { setUser } from '../actions/set-user';
import { ROLE } from '../constants/role';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../selectors';

const regFormSchema = yup.object().shape({
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
		});
	};
	if (roleId !== ROLE.READER) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
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
	& > form {
		display: flex;
		flex-direction: column;
		gap: 10px 0;
	}
`;
