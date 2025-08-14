// Временная версия авторизации с мок-данными
export const Authorizate = async (authLogin, authPassword) => {
	try {
		// Имитируем задержку сети
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Мок-данные для тестирования
		const mockUsers = [
			{ login: 'admin', password: 'admin123', userId: 1, role_id: 0 },
			{ login: 'user', password: 'user1231', userId: 2, role_id: 1 },
			{ login: 'test', password: 'test1231', userId: 3, role_id: 1 },
		];

		const user = mockUsers.find(
			(u) => u.login === authLogin && u.password === authPassword,
		);

		if (user) {
			// Возвращаем данные пользователя без пароля
			const { password, ...userData } = user;
			return {
				error: null,
				res: {
					...userData,
					token: 'mock-jwt-token-' + Date.now(),
				},
			};
		} else {
			return { error: 'Неверный логин или пароль', res: null };
		}
	} catch (err) {
		return { error: 'Ошибка сети', res: null };
	}
};
