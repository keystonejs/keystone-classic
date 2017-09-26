import { rhythm } from 'utils/typography';

// ==============================
// THEME
// ==============================

// breakpoint
export const breakpointNumeric = {
	small: 400,
	medium: 768,
	large: 1024,
	xlarge: 1280,
};
export const breakpoint = {
	mediumUp: `@media (min-width: ${breakpointNumeric.small + 1}px)`,
	largeUp: `@media (min-width: ${breakpointNumeric.medium + 1}px)`,
	xlargeUp: `@media (min-width: ${breakpointNumeric.large + 1}px)`,

	smallOnly: `@media (max-width: ${breakpointNumeric.small}px)`,
	mediumDown: `@media (max-width: ${breakpointNumeric.medium}px)`,
	largeDown: `@media (max-width: ${breakpointNumeric.large}px)`,
};

// container

export const container = {
	small: rhythm(12),
	medium: rhythm(38),
	large: rhythm(44),
};

// color
export const color = {
	blue: '#348dd9',
	blueDark: '#374e61',
	lightBlue: '#ebf4fb',

	// experimental
	orange: '#E59269',
	coral: '#E33367',
	// teal: '#23ACBF', // bright
	teal: '#57A5B4',

	// social
	twitter: '#1DA1F2',

	// neutrals
	gray90: '#1A1A1A',
	gray80: '#333',
	gray70: '#4D4D4D',
	gray60: '#666',
	gray50: '#7F7F7F',
	gray40: '#999',
	gray35: '#a6a6a6',
	gray30: '#B3B3B3',
	gray25: '#bfbfbf',
	gray20: '#CCC',
	gray15: '#D9D9D9',
	gray10: '#E5E5E5',
	gray05: '#F2F2F2',
};

// navbar
export const navbar = {
	widthLarge: 300,
	widthSmall: 240,
};

export default {
	breakpoint,
	color,
	container,
	navbar,
};
