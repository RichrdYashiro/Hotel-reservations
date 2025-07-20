import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { userReducer, roomsReducer, bookingReducer } from './redusers';

const reducer = combineReducers({
	user: userReducer,
	rooms: roomsReducer,
	booking: bookingReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
