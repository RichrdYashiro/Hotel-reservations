export const Registrate = async (login, password) => {
	try {
		const response = await fetch('http://localhost:5000/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ login, password }),
		});

		const data = await response.json();

		if (response.ok) {
			return { res: data, error: null };
		} else {
			return { error: data.message, res: null };
		}
	} catch (err) {
		return { error: 'Ошибка сети', res: null };
	}
};
