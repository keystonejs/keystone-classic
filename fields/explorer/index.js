import React from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';

const doRender = () => {
	const Routes = require('./Routes').default;

	return ReactDOM.render(
		<Routes history={browserHistory} />,
		document.getElementById('explorer')
	);
};

// Support hot reloading
if (module.hot) {
	module.hot.accept('./Routes', doRender);
}

doRender();
