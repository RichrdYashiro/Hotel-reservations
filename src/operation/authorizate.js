import { GetUser } from '../api/get-user';
export const Authorizate = async (authLogin, authPassword) => {
	const user = await GetUser(authLogin);

	if (!user) {
		return {
			error: 'Такой пользователей не найдет',
			res: null,
		};
	}
	const { id, login, password, roleId } = user;
	if (authPassword !== password) {
		return {
			error: 'Неверный пароль',
			res: null,
		};
	}

	return {
		error: null,
		res: {
			login,
			id,
			roleId,
		},
	};
};
