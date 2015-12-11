import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { devTools, persistState } from 'redux-devtools';
import * as reducers from '../reducers/index';
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import routes from '../routes';

let createStoreWithMiddleware;

// Configure the dev tools when in DEV mode
if (Keystone.devMode) {
	createStoreWithMiddleware = compose(
		applyMiddleware(thunkMiddleware),
		reduxReactRouter({routes, createHistory}),
		devTools(),
		persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
	)(createStore);
} else {
	createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
}

const rootReducer = combineReducers(reducers);

export default function configureStore(initialState) {
	return createStoreWithMiddleware(rootReducer, initialState);
}
