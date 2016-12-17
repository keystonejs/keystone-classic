/* eslint-disable key-spacing */
const theme = {};
const { blend, darken, fade, lighten } = require('./utils/color');

// ==============================
// COMMON
// ==============================

// breakpoint

theme.breakpointNumeric = {
	mobile:           480,
	tabletPortrait:   768,
	tabletLandscape:  992,
	desktop:          1200,
};
theme.breakpoint = {
	tabletPortraitMin:  (theme.breakpointNumeric.mobile + 1) + 'px',
	tabletLandscapeMin: (theme.breakpointNumeric.tabletPortrait + 1) + 'px',
	desktopMin:         (theme.breakpointNumeric.tabletLandscape + 1) + 'px',
	desktopLargeMin:    (theme.breakpointNumeric.desktop + 1) + 'px',

	mobileMax:           theme.breakpointNumeric.mobile + 'px',
	tabletPortraitMax:   theme.breakpointNumeric.tabletPortrait + 'px',
	tabletLandscapeMax:  theme.breakpointNumeric.tabletLandscape + 'px',
	desktopMax:          theme.breakpointNumeric.desktop + 'px',
};

// container

theme.container = {
	gutter: 20,
	size: {
		small:  750,
		medium: 970,
		large: 1170,
	},
};

// color

theme.color = {
	body:                '#fafafa',
	link:                '#1385e5',
	linkHover:           lighten('#1385e5', 10),
	text:                '#1A1A1A',

	// contextual
	success:             '#34c240',
	create:              '#34c240', // alias for success
	primary:             '#1385e5',
	info:                '#1385e5', // alias for primary
	warning:             '#FA3',
	danger:              '#d64242',
	error:               '#d64242', // alias for danger

	// neutrals
	gray90:              '#1A1A1A',
	gray80:              '#333',
	gray70:              '#4D4D4D',
	gray60:              '#666',
	gray50:              '#7F7F7F',
	gray40:              '#999',
	gray30:              '#B3B3B3',
	gray20:              '#CCC',
	gray15:              '#D9D9D9',
	gray10:              '#E5E5E5',
	gray05:              '#F2F2F2',

	// social
	facebook:            '#3B5998',
	google:              '#DC4E41',
	instagram:           '#3f729b',
	pinterest:           '#bd081c',
	tumblr:              '#35465c',
	twitter:             '#55ACEE',
	youtube:             '#cd201f',
	vimeo:               '#1ab7ea',
};

// border radii

theme.borderRadius = {
	small: '0.125rem',
	default: '0.3rem',
	large: '0.5rem',
};

// spacing

theme.spacing = {
	xsmall:      5,
	small:       10,
	default:     20,
	large:       30,
	xlarge:      40,
	xxlarge:     60,
};

// ==============================
// ELEMENTAL SPECIFIC
// ==============================

// button

theme.button = {
	borderRadius: theme.borderRadius.default,
	borderWidth: 1,
	font: {
		weight: 500,
	},
	paddingHorizontal: '1em',
	default: {
		bgColor: theme.color.primary,
		borderColor: blend(theme.color.primary, theme.color.body, 60),
		textColor: theme.color.primary,
	},
	primary: {
		bgColor: theme.color.primary,
		borderColor: blend(theme.color.primary, theme.color.body, 60),
		textColor: theme.color.primary,
	},
	success: {
		bgColor: theme.color.success,
		borderColor: blend(theme.color.success, theme.color.body, 60),
		textColor: theme.color.success,
	},
	warning: {
		bgColor: theme.color.warning,
		borderColor: blend(theme.color.warning, theme.color.body, 60),
		textColor: theme.color.warning,
	},
	danger: {
		bgColor: theme.color.danger,
		borderColor: blend(theme.color.danger, theme.color.body, 60),
		textColor: theme.color.danger,
	},
};

// blank state

theme.blankstate = {
	background: darken(theme.color.body, 4),
	borderRadius: theme.borderRadius.default,
	color: theme.color.gray40,
	paddingHorizontal: '2em',
	paddingVertical: '4em',
};

// font

theme.font = {
	family: {
		mono: 'Menlo, Monaco, Consolas, "Courier New", monospace',
		sansSerif: '"Helvetica Neue", Helvetica, Arial, sans-serif',
		serif: 'Georgia, Times New Roman, Times, serif',
	},
	size: {
		xxsmall: '0.65rem',
		xsmall: '0.75rem',
		small: '0.85rem',
		default: '1rem',
		medium: '1.2rem',
		large: '1.6rem',
		xlarge: '2.4rem',
		xxlarge: '3.2rem',
	},
};

// form

theme.form = {
	label: {
		color: theme.color.gray50,
		fontSize: '1rem',
		fontWeight: 'normal',
		width: 180,
	},
	note: {
		color: theme.color.gray40,
		fontSize: '0.9em',
	},
};

// component

theme.component = {
	lineHeight: '2.3em',
	height: '2.4em',
	padding: '1em',
};

// input

theme.input = {
	background: {
		default: 'white',
		disabled: '#fafafa',
		noedit: darken(theme.color.body, 2),
	},
	placeholderColor: '#aaa',
	lineHeight: theme.component.lineHeight,
	height: theme.component.height,
	border: {
		color: {
			default: '#ccc',
			focus: theme.color.info,
			hover: '#bbb',
			noedit: darken(theme.color.body, 8),
		},
		radius: theme.borderRadius.default,
		width: 1,
	},
	boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
	boxShadowFocus: `inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px ${fade(theme.color.info, 10)}`,
	paddingHorizontal: '.75em',
};

// select

theme.select = {
	boxShadow: '0 1px 1px rgba(0, 0, 0, 0.075)',
};

// alert

theme.alert = {
	padding: '0.75em  1em',
	margin: '0 0 1em',
	borderWidth: 1,
	borderRadius: theme.borderRadius.default,

	color: {
		danger: {
			background: fade(theme.color.danger, 10),
			border: fade(theme.color.danger, 10),
			text: theme.color.danger,
		},
		info: {
			background: fade(theme.color.primary, 10),
			border: fade(theme.color.primary, 10),
			text: theme.color.primary,
		},
		success: {
			background: fade(theme.color.success, 10),
			border: fade(theme.color.success, 10),
			text: theme.color.success,
		},
		warning: {
			background: fade(theme.color.warning, 10),
			border: fade(theme.color.warning, 10),
			text: theme.color.warning,
		},
	},
};

// glyph

theme.glyph = {
	color: {
		danger: theme.color.danger,
		inherit: 'inherit',
		inverted: 'white',
		primary: theme.color.primary,
		success: theme.color.success,
		warning: theme.color.warning,
	},
	size: {
		small: 16,
		medium: 32,
		large: 64,
	},
};

// modal

theme.modal = {
	background: 'rgba(0, 0, 0, 0.8)',
	zIndex: 100,
	padding: {
		dialog: {
			horizontal: '1em',
			vertical: 0,
		},
		body: {
			horizontal: 0,
			vertical: '1em',
		},
		footer: {
			horizontal: 0,
			vertical: '1em',
		},
		header: {
			horizontal: 0,
			vertical: '0.6em',
		},
	},
};

// pagination

theme.pagination = {
	color: theme.color.gray60,

	hover: {
		background: 'white',
		border: 'rgba(0, 0, 0, 0.1)',
		color: theme.color.gray60,
	},
	selected: {
		background: 'rgba(0, 0, 0, 0.05)',
		border: 'transparent',
		color: theme.color.gray60,
	},
	disabled: {
		background: 'transparent',
		color: theme.color.gray40,
	},
};

// spinner

theme.spinner = {
	color: {
		danger: theme.color.danger,
		default: theme.color.gray40,
		inverted: 'white',
		primary: theme.color.primary,
		success: theme.color.success,
		warning: theme.color.warning,
	},
	size: {
		small:	4,
		medium:	8,
		large:	16,
	},
};

module.exports = theme;
