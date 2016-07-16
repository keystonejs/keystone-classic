/* eslint-disable key-spacing */
const theme = {};
const { fade } = require('../utils/colors');

// ==============================
// COMMON
// ==============================

// breakpoint

theme.breakpointNumeric = {
	mobile:           480,
	tabletPortrait:   768,
	tabletLandscape:  1024,
	desktop:          1280,
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

// color

theme.color = {
	light:               '#fcfcfc',

	text:                '#1A1A1A',

	// contextual
	success:             '#00b368',
	create:              '#00b368', // alias for success
	primary:             '#1385e5',
	info:                '#1385e5', // alias for primary
	warning:             '#FA3',
	danger:              '#bf0020',
	error:               '#bf0020', // alias for danger

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
	default: '0.25rem',
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
	font: {
		weight: 500,
	},
	paddingHorizontal: '1em',
};

/*
default-color:              theme.color.primary,
default-border:             mix(theme.color.primary, @body-bg, 60%),
default-disabled-bg:        darken(@body-bg, 4%),

primary-color:              theme.color.primary,
primary-bg:                 theme.color.primary,
primary-border:             mix(@button-primary-bg, @body-bg, 60%),

success-color:              @app-success,
success-bg:                 @app-success,
success-border:             mix(@button-success-bg, @body-bg, 60%),

warning-color:              @app-warning,
warning-bg:                 @app-warning,
warning-border:             mix(@button-warning-bg, @body-bg, 60%),

danger-color:               @app-danger,
danger-bg:                  @app-danger,
danger-border:              mix(@button-danger-bg, @body-bg, 60%),

link-disabled-color:        @gray-light,
*/

// form

theme.form = {
	label: {
		color: theme.color.gray60,
		fontSize: '0.9em',
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
	bgColor: 'white',
	bgDisabled: '#fafafa',
	placeholderColor: '#aaa',
	lineHeight: theme.component.lineHeight,
	height: theme.component.height,
	border: {
		color: '#ccc',
		colorHover: '#bbb',
		colorFocus: theme.color.info,
	},
	boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
	boxShadowFocus: `inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px ${fade(theme.color.info, 10)}`,
	paddingHorizontal: '.75em',
};

module.exports = theme;
