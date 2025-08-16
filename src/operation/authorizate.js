// Реальная авторизация через API
export const Authorizate = async (authLogin, authPassword) => {
	try {
		const response = await fetch('http://localhost:5000/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				login: authLogin,
				password: authPassword,
			}),
			credentials: 'include', // Важно для работы с сессиями
		});

		const data = await response.json();

		if (response.ok) {
			return {
				error: null,
				res: {
					userId: data.userId,
					role_id: data.role_id,
					token: data.token,
				},
			};
		} else {
			return { error: data.message || 'Ошибка авторизации', res: null };
		}
	} catch (err) {
		console.error('Ошибка при авторизации:', err);
		return { error: 'Ошибка сети', res: null };
	}
};

// Проверка авторизации по сессии
export const checkAuth = async () => {
	try {
		const response = await fetch('http://localhost:5000/api/auth/check', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // Важно для работы с сессиями
		});

		const data = await response.json();

		if (response.ok) {
			return {
				error: null,
				res: {
					userId: data.userId,
					role_id: data.role_id,
					token: data.token,
				},
			};
		} else {
			return { error: 'Не авторизован', res: null };
		}
	} catch (err) {
		console.error('Ошибка при проверке авторизации:', err);
		return { error: 'Ошибка сети', res: null };
	}
};

// Выход из системы
export const logout = async () => {
	try {
		const response = await fetch('http://localhost:5000/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // Важно для работы с сессиями
		});

		const data = await response.json();

		if (response.ok) {
			return { error: null, res: data.message };
		} else {
			return { error: data.message || 'Ошибка при выходе', res: null };
		}
	} catch (err) {
		console.error('Ошибка при выходе из системы:', err);
		return { error: 'Ошибка сети', res: null };
	}
};
