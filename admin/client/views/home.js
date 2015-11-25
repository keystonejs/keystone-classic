'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../containers/App';

let listsByKey = {};
Keystone.lists.forEach((list) => {
	listsByKey[list.key] = list;
});

ReactDOM.render(
	<App />,
	document.getElementById('home-view')
);
