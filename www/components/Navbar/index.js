import React, { Component, PropTypes } from 'react';
import Link from 'gatsby-link';
// import MenuIcon from 'react-icons/lib/md/menu';
import DemoIcon from 'react-icons/lib/go/link-external';
import GithubIcon from 'react-icons/lib/go/mark-github';
import TwitterIcon from 'react-icons/lib/ti/social-twitter';

import typography from '../../utils/typography';
import invertedLogo from '../../images/logo-inverted.svg';
import theme from '../../theme';

class Navbar extends Component {
	render () {
		return (
			<aside css={styles.sidebar}>
				<Link to="/" css={styles.header__brand}>
					<img src={invertedLogo} height="60" css={{ margin: 0 }} />
				</Link>
				<div css={styles.header__links}>
					<a href="http://demo.keystonejs.com" target="_blank" css={styles.header__link}>
						<DemoIcon css={styles.header__linkIcon} />
						Demo
					</a>
					<a href="https://github.com/keystonejs/keystone" target="_blank" css={styles.header__link}>
						<GithubIcon css={styles.header__linkIcon} />
						GitHub
					</a>
				</div>
				<Menu items={this.props.items} />
				<a href="https://twitter.com/keystonejs" target="_blank" css={styles.twitter}>
					<TwitterIcon css={styles.twitterIcon} />
					Twitter
				</a>
			</aside>
		);
	};
};

Navbar.propTypes = {
	closeNavigation: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.shape({
		section: PropTypes.string,
		items: PropTypes.shape({
			label: PropTypes.string,
			slug: PropTypes.string,
		}),
	})).isRequired,
	openNavigation: PropTypes.func.isRequired,
};

const Menu = ({ items }) => {
	const list = items.map((section, idx) => {
		return (
			<ul key={idx} css={styles.menu}>
				<li css={styles.section}>{section.section}</li>
				{section.items.map(({ label, slug }) => (
					<Item
						key={slug}
						title={label}
						url={slug}
					/>
				))}
			</ul>
		);
	});

	return <nav>{list}</nav>;
};

function Item ({ title, url }) {
	return (
		<li css={styles.item}>
			<Link
				onlyActiveOnIndex
				css={styles.link}
				activeStyle={styles.link__active}
				to={url}
			>
				{title}
			</Link>
		</li>
	);
};

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	sidebar: {
		backgroundColor: theme.color.blueDark,
		color: 'white',
		fontSize: '0.9em',
		letterSpacing: '0.01em',
		lineHeight: typography.options.baseLineHeight,
		width: '100%',

		[theme.breakpoint.mediumUp]: {
			bottom: 0,
			height: '100%',
			left: 0,
			overflowY: 'auto',
			position: 'fixed',
			top: 0,
			width: theme.sidebar.widthSmall,
		},
		[theme.breakpoint.largeUp]: {
			width: theme.sidebar.widthLarge,
		},
	},

	// header
	header__brand: {
		display: 'block',
		lineHeight: 0,
		padding: '2em 0',
		textAlign: 'center',
		textDecoration: 'none',
	},
	header__links: {
		display: 'flex',
	},
	header__linkIcon: {
		marginRight: '0.5em',
	},
	header__link: {
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		color: 'white',
		display: 'flex',
		flex: 1,
		height: '44px',
		justifyContent: 'center',
		lineHeight: '44px',
		opacity: 0.9,
		padding: '0 1em',
		textAlign: 'center',
		textDecoration: 'none',

		':hover': {
			opacity: 1,
		},

		':first-child': {
			marginRight: 1,
		},
	},

	// menu
	menu: {
		listStyle: 'none',
		margin: 0,
		paddingRight: '1em',
	},

	// item
	item: {
		fontWeight: 300,
		margin: '0 0 2px',
	},
	section: {
		fontSize: '1.3em',
		marginTop: '1.8em',
		opacity: 0.6,
		padding: `0 1rem`,
		textTransform: 'uppercase',

		[theme.breakpoint.largeUp]: {
			paddingLeft: `2rem`,
			paddingRight: `2rem`,
		},
	},
	link: {
		borderBottomRightRadius: 3,
		borderTopRightRadius: 3,
		color: 'white',
		display: 'block',
		padding: `0.5em 1rem`,
		textDecoration: 'none',
		transition: 'opacity 100ms',

		':hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.1)',
		},
		[theme.breakpoint.largeUp]: {
			paddingLeft: `2rem`,
			paddingRight: `2rem`,
		},
	},
	link__active: {
		backgroundColor: theme.color.blue,
		opacity: 1,
	},

	// twitter
	twitter: {
		alignItems: 'center',
		backgroundColor: theme.color.twitter,
		color: 'white',
		display: 'flex',
		fontSize: '1.2em',
		marginTop: '2em',
		justifyContent: 'center',
		padding: '0.75em 1em',
		textDecoration: 'none',
	},
	twitterIcon: {
		fontSize: 24,
		marginRight: '0.5em',
	},
};

export default Navbar;
