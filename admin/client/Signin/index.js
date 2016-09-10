/**
 * The signin page, it renders a page with a username and password input form.
 *
 * This is decoupled from the main app (in the "App/" folder) because we inject
 * lots of data into the other screens (like the lists that exist) that we don't
 * want to have injected here, so this is a completely separate route and template.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Signin from './Signin';

ReactDOM.render(
	<Signin
		brand={Keystone.brand}
		from={Keystone.from}
		logo={Keystone.logo}
		user={Keystone.user}
		userCanAccessKeystone={Keystone.userCanAccessKeystone}
	/>,
	document.getElementById('signin-view')
);
