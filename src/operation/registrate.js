// Реальная регистрация через API
export const Registrate = async (login, password) => {
	try {
		const response = await fetch('http://localhost:5000/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				login,
				password,
			}),
			credentials: 'include', // Важно для работы с сессиями
		});

		const data = await response.json();

		if (response.ok) {
			// После успешной регистрации выполняем вход
			const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					login,
					password,
				}),
				credentials: 'include', // Важно для работы с сессиями
			});

			if (loginResponse.ok) {
				const loginData = await loginResponse.json();
				return {
					error: null,
					res: {
						userId: loginData.userId,
						login,
						role_id: loginData.role_id,
						token: loginData.token,
					},
				};
			} else {
				const loginError = await loginResponse.json();
				return { error: loginError.message || 'Ошибка входа после регистрации', res: null };
			}
		} else {
			return { error: data.message || 'Ошибка регистрации', res: null };
		}
	} catch (err) {
		console.error('Ошибка при регистрации:', err);
		return { error: 'Ошибка сети', res: null };
	}
};
