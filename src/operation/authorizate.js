export const Authorizate = async (authLogin, authPassword) => {
	try {
		const response = await fetch('http://localhost:5000/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ login: authLogin, password: authPassword }),
		});

		const data = await response.json();

		if (response.ok) {
			return { error: null, res: data };
		} else {
			return { error: data.message, res: null };
		}
	} catch (err) {
		return { error: 'Ошибка сети', res: null };
	}
};
