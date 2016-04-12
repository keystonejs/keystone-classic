import { createStore, combineReducers, applyMiddleware } from 'redux';
import ListsReducer from './screens/List/reducer';
import thunk from 'redux-thunk';

const reducers = combineReducers({
	lists: ListsReducer,
});

const store = createStore(
	reducers,
	applyMiddleware(thunk)
);

export default store;
