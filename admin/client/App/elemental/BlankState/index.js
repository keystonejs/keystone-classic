import { css } from 'glamor';
import React, { PropTypes } from 'react';
import theme from '../../../theme';

function BlankState ({
	className,
	children,
	heading,
	component: Component,
	...props
}) {
	props.className = css(
		classes.container,
		className
	);

	return (
		<Component {...props}>
			{!!heading && <h2 data-e2e-blank-state-heading className={css(classes.heading)}>{heading}</h2>}
			{children}
		</Component>
	);
};

BlankState.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]).isRequired,
	heading: PropTypes.string,
};
BlankState.defaultProps = {
	component: 'div',
};

/* eslint quote-props: ["error", "as-needed"] */

const classes = {
	container: {
		backgroundColor: theme.blankstate.background,
		borderRadius: theme.blankstate.borderRadius,
		color: theme.blankstate.color,
		paddingBottom: theme.blankstate.paddingVertical,
		paddingLeft: theme.blankstate.paddingHorizontal,
		paddingRight: theme.blankstate.paddingHorizontal,
		paddingTop: theme.blankstate.paddingVertical,
		textAlign: 'center',
	},

	heading: {
		color: 'inherit',

		':last-child': {
			marginBottom: 0,
		},
	},
};

module.exports = BlankState;
