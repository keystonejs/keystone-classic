import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../stores/configureStore';
import { renderDevTools } from '../utils/devTools';
import { ReduxRouter } from 'redux-router';
import routes from '../routes';

const store = configureStore();

let listsByKey = {};
Keystone.lists.forEach((list) => {
	listsByKey[list.key] = list;
});

export default class App extends React.Component {
	render() {
		return (
		<div>

			<Provider store={store}>
				<ReduxRouter>
					{routes}
				</ReduxRouter>
			</Provider>

			{/* only renders when running in DEV mode */
			renderDevTools(store)
			}
		</div>
		);
	}
}
