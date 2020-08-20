import React, { Component } from "react";
import Link from "gatsby-link";
// import GithubIcon from 'react-icons/lib/go/mark-github';
import MenuClose from "react-icons/lib/md/close";
import MenuIcon from "react-icons/lib/md/menu";
// import TwitterIcon from 'react-icons/lib/ti/social-twitter';

import typography from "../../utils/typography";
import invertedLogo from "../../images/logo-inverted.svg";
import theme from "../../theme";

import { itemsShape } from "./utils";
import Menu from "./Menu";

class Navbar extends Component {
	constructor(props) {
		super(props);

		this.toggleNavMenu = this.toggleNavMenu.bind(this);

		this.state = { menuIsOpen: false };
	}
	toggleNavMenu(menuIsOpen) {
		this.setState({ menuIsOpen });
	}
	render() {
		const { menuIsOpen } = this.state;

		return (
			<aside css={styles.navbar}>
				<div css={styles.header}>
					<Link to="/" css={styles.brand}>
						<img src={invertedLogo} css={styles.brandIcon} />
					</Link>
					<div css={styles.github}>
						<a
							href="https://github.com/keystonejs"
							target="_blank"
							css={[styles.github__link, styles.github__org]}
						>
							KeystoneJS
						</a>
						<span css={styles.github__divider}>/</span>
						<a
							href="https://github.com/keystonejs/keystone"
							target="_blank"
							css={[styles.github__link, styles.github__repo]}
						>
							Keystone
						</a>
					</div>
					<button
						onClick={() => this.toggleNavMenu(!menuIsOpen)}
						css={styles.menuButton}
					>
						{menuIsOpen ? (
							<MenuClose css={styles.menuIcon} />
						) : (
							<MenuIcon css={styles.menuIcon} />
						)}
					</button>
				</div>
				<div css={[styles.menu, menuIsOpen && styles.menu__open]}>
					<Menu items={this.props.items} pathname={this.props.pathname} />
				</div>
			</aside>
		);
	}
}

Navbar.propTypes = {
	items: itemsShape.isRequired
};

const mobileHeaderHeight = 60;

/* eslint quote-props: ["error", "as-needed"] */
const styles = {
	navbar: {
		backgroundColor: theme.color.blue,
		backgroundImage: "linear-gradient(160deg, #34b6d9, #3464d9)",
		color: "white",
		fontSize: "0.9em",
		letterSpacing: "0.01em",
		lineHeight: typography.options.baseLineHeight,
		position: "relative",
		width: "100%",
		zIndex: 1,

		[theme.breakpoint.largeUp]: {
			bottom: 0,
			height: "100%",
			left: 0,
			overflowY: "auto",
			paddingBottom: "3em",
			position: "absolute",
			top: 0,
			width: theme.navbar.widthSmall
		},
		[theme.breakpoint.xlargeUp]: {
			width: theme.navbar.widthLarge
		}
	},

	// nav
	nav: {
		display: "flex",
		fontWeight: "normal",
		lineHeight: 1.1,

		[theme.breakpoint.mediumDown]: {
			flex: "1 1 auto"
		},
		[theme.breakpoint.largeUp]: {
			backgroundColor: "white",
			borderRadius: 4,
			boxShadow: "0 2px 1px rgba(0, 0, 0, 0.2)",
			marginLeft: "1rem",
			marginRight: "1rem"
		}
	},
	navitem: {
		alignItems: "center",
		display: "flex",
		flex: "1 0 auto",
		justifyContent: "center",
		paddingBottom: "0.5rem",
		paddingTop: "0.5rem",
		textDecoration: "none",

		[theme.breakpoint.mediumDown]: {
			color: "white"
		},
		[theme.breakpoint.largeUp]: {
			color: theme.color.blue,

			":not(:first-child)": {
				boxShadow: "-1px 0 0 rgba(0, 0, 0, 0.1)"
			}
		}
	},

	// header
	header: {
		[theme.breakpoint.mediumDown]: {
			alignItems: "center",
			borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
			display: "flex",
			height: mobileHeaderHeight,
			justifyContent: "space-between",
			paddingLeft: "1em",
			paddingRight: "1em"
		}
	},

	// brand
	brand: {
		// alignItems: 'space-between',
		// display: 'flex',
		// flexDirection: 'column',
		// justifyContent: 'center',
		display: "block",
		textAlign: "center",
		textDecoration: "none",

		[theme.breakpoint.largeUp]: {
			padding: "2em 0 0"
		}
	},
	brandIcon: {
		height: 50,
		margin: 0,

		[theme.breakpoint.mediumDown]: {
			height: 30
		}
	},
	brandLabel: {
		color: "white",
		display: "none",

		[theme.breakpoint.largeUp]: {
			display: "block"
		}
	},
	github: {
		display: "flex",
		justifyContent: "center",
		marginBottom: "1em",

		[theme.breakpoint.mediumDown]: {
			visibility: "hidden",
			position: "absolute",
			height: 1,
			width: 1
		}
	},
	github__link: {
		color: "white",
		padding: "0.5em",
		textDecoration: "none",

		":hover": {
			textDecoration: "underline"
		}
	},
	github__org: {
		opacity: 0.75
	},
	github__divider: {
		color: "white",
		opacity: 0.75,
		paddingBottom: "0.5em",
		paddingTop: "0.5em"
	},
	github__repo: {},

	// mobile
	menu: {
		[theme.breakpoint.mediumDown]: {
			backgroundColor: theme.color.blue,
			boxShadow: "0 -1px 0 rgba(255, 255, 255, 0.4)",
			display: "none",
			position: "absolute",
			top: mobileHeaderHeight,
			width: "100%"
		}
	},
	menu__open: {
		[theme.breakpoint.mediumDown]: {
			display: "block"
		}
	},
	menuButton: {
		background: "none",
		border: 0,
		color: "white",
		display: "none",
		fontSize: 32,
		lineHeight: 0,
		outline: 0,
		padding: 0,

		[theme.breakpoint.mediumDown]: {
			display: "inline-block"
		}
	},
	menuIcon: {}
};

export default Navbar;
