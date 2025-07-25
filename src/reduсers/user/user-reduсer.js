import { ROLE } from '../../constants/role';
const initialUserState = {
	login: null,
	id: null,
	roleId: ROLE.READER,
};

export const userReducer = (state = initialUserState, action) => {
	switch (action.type) {
		case 'SET_USER': {
			return {
				...state,
				...action.payload,
			};
		}
		default:
			return state;
	}
};
