import React, { Component, PropTypes } from 'react';
import Link from 'gatsby-link';
import MenuIcon from 'react-icons/lib/md/menu';
import MenuClose from 'react-icons/lib/md/close';
import DemoIcon from 'react-icons/lib/go/link-external';
import GithubIcon from 'react-icons/lib/go/mark-github';
import TwitterIcon from 'react-icons/lib/ti/social-twitter';

import typography from '../../utils/typography';
import invertedLogo from '../../images/logo-inverted.svg';
import theme from '../../theme';

import { itemsShape } from './utils';
import Menu from './Menu';

class Navbar extends Component {
	constructor (props) {
		super(props);

		this.toggleNavMenu = this.toggleNavMenu.bind(this);

		this.state = { menuIsOpen: false };
	}
	toggleNavMenu (menuIsOpen) {
		this.setState({ menuIsOpen });
	}
	render () {
		const { menuIsOpen } = this.state;

		return (
			<aside css={styles.navbar}>
				<div css={styles.header}>
					<Link to="/" css={styles.headerBrand}>
						<img
							src={invertedLogo}
							css={styles.headerBrandIcon}
						/>
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
					<button onClick={() => this.toggleNavMenu(!menuIsOpen)} css={styles.menuButton}>
						{menuIsOpen
							? <MenuClose css={styles.menuIcon} />
							: <MenuIcon css={styles.menuIcon} />}
					</button>
				</div>
				<div css={[styles.menu, menuIsOpen && styles.menu__open]}>
					<Menu items={this.props.items} />
				</div>
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
	items: itemsShape.isRequired,
	menuIsOpen: PropTypes.bool.isRequired,
	openNavigation: PropTypes.func.isRequired,
};

const mobileHeaderHeight = 60;

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	navbar: {
		backgroundColor: theme.color.blueDark,
		color: 'white',
		fontSize: '0.9em',
		letterSpacing: '0.01em',
		lineHeight: typography.options.baseLineHeight,
		width: '100%',

		[theme.breakpoint.largeUp]: {
			bottom: 0,
			height: '100%',
			left: 0,
			overflowY: 'auto',
			position: 'fixed',
			top: 0,
			width: theme.navbar.widthSmall,
		},
		[theme.breakpoint.xlargeUp]: {
			width: theme.navbar.widthLarge,
		},
	},

	// mobile
	menu: {
		[theme.breakpoint.mediumDown]: {
			backgroundColor: theme.color.blueDark,
			display: 'none',
			position: 'absolute',
			top: mobileHeaderHeight,
			width: '100%',
		},
	},
	menu__open: {
		[theme.breakpoint.mediumDown]: {
			display: 'block',
		},
	},
	menuButton: {
		background: 'none',
		border: 0,
		color: 'white',
		display: 'none',
		fontSize: 32,
		lineHeight: 0,
		outline: 0,
		padding: 0,

		[theme.breakpoint.mediumDown]: {
			display: 'inline-block',
		},
	},
	menuIcon: {},

	// header
	header: {
		[theme.breakpoint.mediumDown]: {
			alignItems: 'center',
			borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
			display: 'flex',
			height: mobileHeaderHeight,
			justifyContent: 'space-between',
			paddingLeft: '1em',
			paddingRight: '1em',
		},
	},
	headerBrand: {
		display: 'block',
		lineHeight: 0,
		textAlign: 'center',
		textDecoration: 'none',

		[theme.breakpoint.largeUp]: {
			padding: '2em 0',
		},
	},
	headerBrandIcon: {
		height: 60,
		margin: 0,

		[theme.breakpoint.mediumDown]: {
			height: 30,
		},
	},

	header__links: {
		display: 'flex',
	},
	header__linkIcon: {
		marginRight: '0.5em',
	},
	header__link: {
		alignItems: 'center',
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

		[theme.breakpoint.largeUp]: {
			backgroundColor: 'rgba(0, 0, 0, 0.3)',
		},
	},

	menu__active: {},

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

		[theme.breakpoint.mediumDown]: {
			display: 'none',
		},
	},
	twitterIcon: {
		fontSize: 24,
		marginRight: '0.5em',
	},
};

export default Navbar;
