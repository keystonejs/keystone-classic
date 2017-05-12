import React, { PropTypes } from 'react';

export default function DefaultLayout (props) {
	return <div {...props} />;
};

DefaultLayout.PropTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};
