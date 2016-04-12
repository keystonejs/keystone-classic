/**
 * This is the main entry file, which we compile the main JS bundle from. It
 * only contains the client side routing setup.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import App from './App';
import Home from './App/screens/Home';
import Item from './App/screens/Item';
import List from './App/screens/List';

import store from './App/store';

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path={Keystone.adminPath} component={App}>
				<IndexRoute component={Home} />
				<Route path=":listId" component={List} />
				<Route path=":listId/:itemId" component={Item} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('react-root')
);
