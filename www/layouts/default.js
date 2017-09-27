import React, { PropTypes } from 'react';
// import Navbar from './components/Navbar';
// import { api, documentation, gettingStarted, guides } from '../data/navigation';

// const items = [gettingStarted, guides, documentation, api];

export default function DefaultLayout ({ children, location }) {
	// TODO should be explicit prop
	// const isHome = location.pathname.length > 1;

	return (
		<div>
			{/* <Navbar
				isHome={isHome}
				items={items}
			/> */}
			{children}
		</div>
	);
};

DefaultLayout.PropTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};
