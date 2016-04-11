/**
 * This is the main entry file, which we compile the main JS bundle from. It
 * only contains the client side routing setup.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from './App';
import Home from './App/screens/Home';
import Item from './App/screens/Item';
import List from './App/screens/List';

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/keystone" component={App}>
			<IndexRoute component={Home} />
			<Route path=":listId" component={List} />
			<Route path=":listId/:itemId" component={Item} />
		</Route>
	</Router>,
	document.getElementById('react-root')
);
