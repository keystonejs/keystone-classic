import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import Lists from './stores/Lists';

import MobileNavigation from './components/Navigation/MobileNavigation';
import PrimaryNavigation from './components/Navigation/PrimaryNavigation';
import SecondaryNavigation from './components/Navigation/SecondaryNavigation';
import Footer from './components/Footer';
import Home from './views/Home';
import Item from './views/Item';
import List from './views/List';

const App = (props) => {
	// If we're on either a list or an item view
	let currentList, currentSection;
	if (props.params.listId) {
		currentList = Lists[props.params.listId];
		// Get the current section we're in for the navigation
		currentSection = Keystone.nav.by.list[currentList.key];
	}
	// Default current section key to dashboard
	const currentSectionKey = (currentSection && currentSection.key) || 'dashboard';
	return (
		<div className="keystone-wrapper">
			<header className="keystone-header">
				<MobileNavigation
					brand={Keystone.brand}
					currentListKey={props.params.listId}
					currentSectionKey={currentSectionKey}
					sections={Keystone.nav.sections}
					signoutUrl={Keystone.signoutUrl}
				/>
				<PrimaryNavigation
					currentSectionKey={currentSectionKey}
					brand={Keystone.brand}
					sections={Keystone.nav.sections}
					signoutUrl={Keystone.signoutUrl}
				/>
				{(currentSection) ? (
					<SecondaryNavigation
						currentListKey={props.params.listId}
						lists={currentSection.lists}
					/>
				) : null}
			</header>
			<div className="keystone-body">
				{props.children}
			</div>
			<Footer
				appversion={Keystone.appversion}
				backUrl={Keystone.backUrl}
				brand={Keystone.brand}
				User={Keystone.User}
				user={Keystone.user}
				version={Keystone.version}
			/>
		</div>
	);
};

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
