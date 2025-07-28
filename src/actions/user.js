import { Authorizate } from '../operation/authorizate';
export const SET_USER = 'SET_USER';

export const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

export const AUTHORIZE_USER = 'AUTHORIZE_USER';

export const authorizeUser = (authLogin, authPassword) => async (dispatch) => {
	const { error, res } = await Authorizate(authLogin, authPassword);

	if (error) {
		dispatch({
			type: AUTHORIZE_USER,
			payload: { error },
		});
	} else {
		dispatch({
			type: AUTHORIZE_USER,
			payload: { user: res },
		});
	}
};
