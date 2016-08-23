import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import App from './App';
import Home from './screens/Home';
import Item from './screens/Item';
import List from './screens/List';

const Routes = ({ store, history, adminPath }) => {
	return (
		<Provider store={store}>
			<Router history={history}>
				<Route path={adminPath} component={App}>
					<IndexRoute component={Home} />
					<Route path=":listId" component={List} />
					<Route path=":listId/:itemId" component={Item} />
				</Route>
			</Router>
		</Provider>
	);
};
Routes.propTypes = {
	adminPath: PropTypes.string.isRequired,
	history: PropTypes.object.isRequired,
	store: PropTypes.object.isRequired,
};

export default Routes;
