/* eslint quote-props: ["error", "as-needed"] */

import React from 'react';
import { css } from 'glamor';
import Button from '../Button';

function DropdownButton ({ children, ...props }) {
	return (
		<Button {...props}>
			{children}
			<span className={css(classes.arrow)} />
		</Button>
	);
};

// NOTE
// 1: take advantage of `currentColor` by leaving border top color undefined
// 2: even though the arrow is vertically centered, visually it appears too low
//    because of lowercase characters beside it
const classes = {
	arrow: {
		borderLeft: '0.3em solid transparent',
		borderRight: '0.3em solid transparent',
		borderTop: '0.3em solid', // 1
		display: 'inline-block',
		height: 0,
		marginTop: '-0.125em', // 2
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
};

module.exports = DropdownButton;
