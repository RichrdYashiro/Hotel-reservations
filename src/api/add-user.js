export const AddUser = async (login, password) => {
	const response = await fetch('http://localhost:3005/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			login,
			password,
			role_id: 1,
		}),
	});
	if (!response.ok) {
		throw new Error('Ошибка регистрации');
	}
	return await response.json();
};
