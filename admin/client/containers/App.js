import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../stores/configureStore';
import HomeView from '../components/HomeView';
import { renderDevTools } from '../utils/devTools';

const store = configureStore();

let listsByKey = {};
Keystone.lists.forEach((list) => {
	listsByKey[list.key] = list;
});

export default React.createClass({
	render() {
		return (
		<div>

			<Provider store={store}>
			<HomeView
				appversion={Keystone.appversion}
				backUrl={Keystone.backUrl}
				brand={Keystone.brand}
				nav={Keystone.nav}
				navIsFlat={Keystone.nav.flat}
				navLists={Keystone.lists}
				navSections={Keystone.nav.sections}
				orphanedLists={Keystone.orphanedLists}
				signoutUrl={Keystone.signoutUrl}
				User={Keystone.User}
				user={Keystone.user}
				version={Keystone.version}
			/>
			</Provider>

			{/* only renders when running in DEV mode */
			renderDevTools(store)
			}
		</div>
		);
	}
});
