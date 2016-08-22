import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import listsReducer from './screens/List/reducers/main';
import activeReducer from './screens/List/reducers/active';
import itemReducer from './screens/Item/reducer';
import homeReducer from './screens/Home/reducer';

import rootSaga from './sagas';


// Combine the reducers to one state
const reducers = combineReducers({
	lists: listsReducer,
	active: activeReducer,
	item: itemReducer,
	home: homeReducer,
	routing: routerReducer,
});

const sagaMiddleware = createSagaMiddleware();

// Create the store
const store = createStore(
	reducers,
	compose(
		applyMiddleware(
			// Support thunked actions and react-router-redux
			thunk,
			routerMiddleware(browserHistory),
			sagaMiddleware
		),
		// Support the Chrome DevTools extension
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
);

sagaMiddleware.run(rootSaga);

export default store;
