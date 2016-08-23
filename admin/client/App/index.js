/**
 * This is the main entry file, which we compile the main JS bundle from. It
 * only contains the client side routing setup.
 */

// Needed for ES6 generators (redux-saga) to work
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Routes from './Routes';
import store from './store';

// Sync the browser history to the Redux store
const history = syncHistoryWithStore(browserHistory, store);

// Initialise Keystone.User list
import { listsByKey } from '../utils/lists';
Keystone.User = listsByKey[Keystone.userList];
const { adminPath } = Keystone;

const doRender = () => {
	const Routes = require('./Routes').default;

	return ReactDOM.render(
		<Routes {...{ store, history, adminPath }}/>,
		document.getElementById('react-root')
	);
};

// Support hot reloading
if (module.hot) {
	module.hot.accept('./Routes', doRender);
}

doRender();
