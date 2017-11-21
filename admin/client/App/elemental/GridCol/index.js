import React, { PropTypes } from 'react';

import { css } from 'glamor';

import theme from '../../../theme';

const WIDTHS = {
	'one-whole': '100%',
	'one-half': '50%',
	'one-third': '33.33%',
	'two-thirds': '66.66%',
	'one-quarter': '25%',
	'three-quarters': '75%',

	'one-fifth': '20%',
	'two-fifths': '40%',
	'three-fifths': '60%',
	'four-fifths': '80%',

	'one-sixth': '16.66%',
	'five-sixths': '83.33%',
};

const GridCol = (props, context) => {
	const gutter = props.gutter || context.gutter;
	const xsmall = props.xsmall || context.xsmall;
	const small = props.small || context.small;
	const medium = props.medium || context.medium;
	const large = props.large || context.large;

	const className = css(
		classes['xsmall-' + xsmall],
		classes['small-' + small],
		classes['medium-' + medium],
		classes['large-' + large]
	);

	const componentClassName = `${className}${props.className ? (' ' + props.className) : ''}`;
	const componentStyles = gutter ? {
		paddingLeft: gutter / 2,
		paddingRight: gutter / 2,
	} : {};

	return (
		<div className={componentClassName} style={componentStyles}>
			{props.children}
		</div>
	);
};

GridCol.contextTypes = {
	gutter: PropTypes.number,
	large: PropTypes.string,
	medium: PropTypes.string,
	small: PropTypes.string,
	xsmall: PropTypes.string,
};

GridCol.propTypes = {
	gutter: PropTypes.number,
	large: PropTypes.string,
	medium: PropTypes.string,
	small: PropTypes.string,
	xsmall: PropTypes.string,
};

const classes = {
	...prepareWidths('xsmall', WIDTHS),
	...prepareWidths('small', WIDTHS),
	...prepareWidths('medium', WIDTHS),
	...prepareWidths('large', WIDTHS),
};

/* eslint-disable guard-for-in */
function prepareWidths (prefix, obj) {
	let classes = {};
	switch (prefix) {
		case 'small':
			for (let prop in obj) {
				classes[prefix + '-' + prop] = {
					[`@media (min-width: ${theme.breakpoint.tabletPortraitMin})`]: {
						width: obj[prop],
					},
				};
			}
			break;
		case 'medium':
			for (let prop in obj) {
				classes[prefix + '-' + prop] = {
					[`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
						width: obj[prop],
					},
				};
			}
			break;
		case 'large':
			for (let prop in obj) {
				classes[prefix + '-' + prop] = {
					[`@media (min-width: ${theme.breakpoint.desktopMin})`]: {
						width: obj[prop],
					},
				};
			}
			break;
		default:
			for (let prop in obj) {
				classes[prefix + '-' + prop] = {
					width: obj[prop],
				};
			}

	}

	return classes;
};

module.exports = GridCol;
