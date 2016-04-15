import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import ListsReducer from './screens/List/reducers/main';
import ActiveReducer from './screens/List/reducers/active';

const reducers = combineReducers({
	lists: ListsReducer,
	active: ActiveReducer,
});

const store = createStore(
	reducers,
	applyMiddleware(thunk)
);

export default store;
