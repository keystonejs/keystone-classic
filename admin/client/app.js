import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from './views/App';
import Home from './views/Home';
import Item from './views/Item';
import List from './views/List';

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
