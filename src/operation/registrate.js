import { AddUser } from '../api';
import { GetUser } from '../api';

export const Registrate = async (regLogin, regPassword) => {
	const existedUser = await GetUser(regLogin);

	if (existedUser) {
		return {
			error: 'Пользователь с таким логином уже существует',
			res: null,
		};
	}
	const user = await AddUser(regLogin, regPassword);

	return {
		error: null,
		res: {
			login: user.login,
			id: user.id,
			roleId: user.role_id,
		},
	};
};
