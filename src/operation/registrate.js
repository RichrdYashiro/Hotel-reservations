// Временная версия регистрации с мок-данными
export const Registrate = async (login, password) => {
	try {
		// Имитируем задержку сети
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Мок-данные для тестирования
		const mockUsers = [
			{ login: 'admin', password: 'admin123', userId: 1, role_id: 0 },
			{ login: 'user', password: 'user123', userId: 2, role_id: 1 },
			{ login: 'test', password: 'test123', userId: 3, role_id: 1 },
		];

		// Проверяем, не существует ли уже пользователь с таким логином
		const existingUser = mockUsers.find((u) => u.login === login);

		if (existingUser) {
			return { error: 'Пользователь с таким логином уже существует', res: null };
		}

		// Создаем нового пользователя
		const newUser = {
			login,
			password,
			userId: mockUsers.length + 1,
			role_id: 1, // USER role
		};

		// Возвращаем данные пользователя без пароля
		const { password: _, ...userData } = newUser;
		return {
			res: {
				...userData,
				token: 'mock-jwt-token-' + Date.now(),
			},
			error: null,
		};
	} catch (err) {
		return { error: 'Ошибка сети', res: null };
	}
};
