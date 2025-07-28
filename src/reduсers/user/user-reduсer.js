// src/reducers/user.js
import { ROLE } from '../../constants/role';

const initialUserState = {
	login: null,
	id: null,
	roleId: ROLE.READER,
};

export const userReducer = (state = initialUserState, action) => {
	switch (action.type) {
		case 'SET_USER': {
			const { userId, login, role_id } = action.payload;
			return {
				...state,
				id: userId,
				login,
				roleId: role_id,
			};
		}
		default:
			return state;
	}
};
