import { createStore, combineReducers } from 'redux';
import ListsReducer from './screens/List/reducer';

const reducers = combineReducers({
	lists: ListsReducer,
});

const store = createStore(reducers);

export default store;
