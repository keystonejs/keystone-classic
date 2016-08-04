/* eslint quote-props: ["error", "as-needed"] */

import React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import Button from '../Button';


function DropdownButton ({ children, ...props }) {
	return (
		<Button {...props}>
			{children}
			<span className={css(classes.arrow)} />
		</Button>
	);
};

// general: border color is inherited from the Button so no need to define
// marginTop: whilst vertically centered, it appears to be too low because
// of lowercase chars next to it
const classes = StyleSheet.create({
	arrow: {
		borderLeft: '0.3em solid transparent',
		borderRight: '0.3em solid transparent',
		borderTop: '0.3em solid',
		display: 'inline-block',
		height: 0,
		marginTop: '-0.125em',
		verticalAlign: 'middle',
		width: 0,

		// add spacing
		':first-child': {
			marginRight: '0.5em',
		},
		':last-child': {
			marginLeft: '0.5em',
		},
	},
});

module.exports = DropdownButton;
