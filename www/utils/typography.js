import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';
import { MOBILE_MEDIA_QUERY } from 'typography-breakpoint-constants';

const theme = {
	baseLineHeight: 1.45,
	blockMarginBottom: 0.75,
	bodyColor: '#535353',
	bodyFontFamily: ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
	bodyWeight: 300,
	boldWeight: 500,
	headerColor: '#123d62',
	headerFontFamily: ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
	headerWeight: 400,
	scaleRatio: 2,
	plugins: [
		new CodePlugin(),
	],
	overrideStyles: ({ rhythm, scale }) => ({
		'h1,h2,h3,h4,h5,h6': {
			lineHeight: 1.1,
			// marginTop: rhythm(1),
			marginBottom: rhythm(1 / 2),
		},
		'h1': {
			fontSize: '2.4rem',
		},
		'h2': {
			fontSize: '1.8rem',
			marginTop: '1.6em',
		},
		'h3': {
			fontSize: '1.4rem',
			marginTop: '1.4em',
		},
		'a': {
			color: '#348dd9',
		},
		'blockquote': {
			borderLeft: `${rhythm(1 / 4)} solid #4a4a4a`,
			marginLeft: 0,
			marginRight: 0,
			paddingBottom: rhythm(1 / 2),
			paddingLeft: rhythm(3 / 4),
			paddingTop: rhythm(1 / 2),
		},
		'blockquote *:last-child': {
			marginBottom: 0,
		},
		'h2 code': {
			...scale(3 / 5),
		},
		'h3 code': {
			...scale(2 / 5),
		},
		'h4 code': {
			...scale(0 / 5),
		},
		'h5 code': {
			...scale(-1 / 5),
		},
		'tt, code': {
			fontFamily: 'Monaco, Menlo, Courier, monospace',
		},
		'.gatsby-resp-image-link': {
			marginLeft: rhythm(-3 / 4),
			marginRight: rhythm(-3 / 4),
		},
		'li .gatsby-resp-image-link': {
			marginTop: rhythm(1 / 2),
			marginLeft: rhythm(-7 / 4),
		},
		[MOBILE_MEDIA_QUERY]: {
			html: {
				fontSize: 15 / 16 * 100 + '%',
			},
			blockquote: {
				borderLeft: `${rhythm(3 / 16)} solid #4a4a4a`,
				marginLeft: rhythm(-3 / 4),
				marginRight: 0,
				paddingLeft: rhythm(9 / 16),
			},
		},
	}),
};

const typography = new Typography(theme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
	typography.injectStyles();
}

module.exports = typography;
