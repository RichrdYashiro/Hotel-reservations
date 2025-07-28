import { SET_USER } from '../types/userTypes';

export const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});
