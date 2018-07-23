/**
 * The signin page, it renders a page with a username and password input form.
 *
 * This is decoupled from the main app (in the "App/" folder) because we inject
 * lots of data into the other screens (like the lists that exist) that we don't
 * want to have injected here, so this is a completely separate route and template.
 */
import qs from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import Signin from './Signin';

// Sanitize from param
const internalFromRegex = /^\/[^\/\\]\w+/;
const params = qs.parse(window.location.search.replace(/^\?/, ''));
const from = internalFromRegex.test(params.from) ? params.from : undefined;

ReactDOM.render(
	<Signin
		brand={Keystone.brand}
		from={from}
		logo={Keystone.logo}
		user={Keystone.user}
		userCanAccessKeystone={Keystone.userCanAccessKeystone}
	/>,
	document.getElementById('signin-view')
);
