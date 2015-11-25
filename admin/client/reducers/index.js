import { combineReducers } from 'redux';
import Keystone from './Keystone';
import Home from './Home';

const rootReducer = combineReducers({
	Keystone,
	Home
});

export default rootReducer;
