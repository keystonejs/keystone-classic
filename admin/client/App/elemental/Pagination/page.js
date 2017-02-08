import { css } from 'glamor';
import React, { PropTypes } from 'react';
import theme from '../../../theme';

function Page ({
	disabled,
	selected,
	...props
}) {
	props.className = css(
		classes.page,
		!!disabled && classes.disabled,
		!!selected && classes.selected
	);
	return (
		<button {...props} />
	);
};

Page.propTypes = {
	disabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	selected: PropTypes.bool,
};

/* eslint quote-props: ["error", "as-needed"] */

const selectedStyle = {
	backgroundColor: theme.pagination.selected.background,
	borderColor: theme.pagination.selected.border,
	color: theme.pagination.selected.color,
	cursor: 'default',
	zIndex: 2,
};
const pseudoStyle = {
	backgroundColor: theme.pagination.hover.background,
	borderColor: theme.pagination.hover.border,
	color: theme.pagination.hover.color,
	outline: 'none',
};

const classes = {
	page: {
		appearance: 'none',
		background: 'none',
		border: '1px solid transparent',
		borderRadius: theme.borderRadius.default,
		color: theme.pagination.color,
		cursor: 'pointer',
		display: 'inline-block',
		float: 'left', // Collapse white-space
		marginRight: '0.25em',
		padding: '0 .7em',
		position: 'relative',
		textDecoration: 'none',

		// handle hover and focus
		':hover': pseudoStyle,
		':focus': pseudoStyle,
	},

	// selected page
	selected: {
		...selectedStyle,

		':hover': selectedStyle,
		':focus': selectedStyle,
	},

	// disabled page

	disabled: {
		backgroundColor: theme.pagination.disabled.background,
		borderColor: theme.pagination.disabled.background,
		color: theme.pagination.disabled.color,
		cursor: 'default',
	},
};

export default Page;
