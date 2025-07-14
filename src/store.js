import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { userReducer, roomsReducer, roomReducer} from './redusers';

const reducer = combineReducers({
    user: userReducer,
    rooms: roomsReducer,
    room: roomReducer
})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));