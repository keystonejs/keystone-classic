import React, { PropTypes } from 'react';
import { StyleSheet } from 'aphrodite/no-important';
import cssClassNames from '../../../utils/cssClassNames';

function ScreenReaderOnly ({ component, className, ...props }) {
	props.className = cssClassNames([classes.hidden], className);

	return React.createElement(component, props);
};

ScreenReaderOnly.propTypes = {
	component: PropTypes.node,
};
ScreenReaderOnly.defaultProps = {
	component: 'span',
};

const classes = StyleSheet.create({
	hidden: {
		border: 0,
		clip: 'rect(0,0,0,0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		width: 1,
	},
});

module.exports = ScreenReaderOnly;
