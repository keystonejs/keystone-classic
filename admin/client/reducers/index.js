import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import Keystone from './Keystone';
import Home from './Home';

const rootReducer = combineReducers({
	Keystone,
	Home,
	router: routerStateReducer
});

export default rootReducer;
