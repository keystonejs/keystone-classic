/**
 * This is the main entry file, which we compile the main JS bundle from. It
 * only contains the client side routing setup.
 */

// Needed for ES6 generators (redux-saga) to work
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';

// Sync the browser history to the Redux store
const history = syncHistoryWithStore(browserHistory, store);

// Initialise Keystone.User list
import { listsByKey } from '../utils/lists';
Keystone.User = listsByKey[Keystone.userList];

const doRender = () => {
	const App = require('./App');
	const Home = require('./screens/Home');
	const Item = require('./screens/Item');
	const List = require('./screens/List');

	return ReactDOM.render(
		<Provider store={store}>
			<Router history={history}>
				<Route path={Keystone.adminPath} component={App}>
					<IndexRoute component={Home} />
					<Route path=":listId" component={List} />
					<Route path=":listId/:itemId" component={Item} />
				</Route>
			</Router>
		</Provider>,
		document.getElementById('react-root')
	);
};

// Support hot reloading
if (module.hot) {
	module.hot.accept([
		'./App',
		'./screens/Home',
		'./screens/Item',
		'./screens/List',
	], doRender);
}

doRender();
