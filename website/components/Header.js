import React, { Component } from "react";
import { compose } from "glamor";
import fetch from "unfetch";
import Link from "gatsby-link";
import GithubButton from "./GithubButton";
import logo from "../images/logo-inverted.svg";
import theme from "../theme";

const apiUrl = "https://api.github.com/repos/keystonejs/keystone";

export default class Header extends Component {
	state = { stars: 0 };

	componentDidMount() {
		this.getStarCount();
	}

	getStarCount = () => {
		fetch(apiUrl)
			.then(res => res.json())
			.then(data => {
				const stars = data.stargazers_count;
				this.setState({ stars });
			})
			.catch(err => {
				console.error("Error retrieving data", err);
			});
	};
	render() {
		return (
			<header className={compose(styles.navBar)}>
				<div
					className={compose(
						styles.navBarSide,
						styles.navBarSideLeft
					)}
				>
					<Link to="/">
						<img
							src={logo}
							className={compose(styles.logo)}
							alt="KeystoneJS"
							title="Keystone Classic"
						/>
					</Link>
					<span className={compose(styles.logoText)}>Keystone 4</span>
				</div>
				<ul className={compose(styles.navBarCenter)}>
					<li className={compose(styles.navItem)}>
						<Link to="/getting-started" className={compose(styles.navItemLink)}>
							Get Started
						</Link>
					</li>
					<li className={compose(styles.navItem)}>
						<Link to="/documentation" className={compose(styles.navItemLink)}>
							Documentation
						</Link>
					</li>
					<li className={compose(styles.navItem)}>
						<a
							href="http://demo.keystonejs.com"
							target="_blank"
							className={compose(styles.navItemLink)}
						>
							Examples
						</a>
					</li>
					<li className={compose(styles.navItem)}>
						<a
							href="https://github.com/keystonejs/keystone"
							target="_blank"
							className={compose(styles.navItemLink)}
						>
							Github
						</a>
					</li>
					<li className={compose(styles.navItem)}>
						<a
							href="http://community.keystonejs.com/"
							target="_blank"
							className={compose(styles.navItemLink)}
						>
							Community
						</a>
					</li>
					<li className={compose(styles.buffer)}>&nbsp;</li>
				</ul>
				<div
					className={compose(
						styles.navBarSide,
						styles.navBarSideRight
					)}
				>
					<GithubButton
						count={this.state.stars}
						repo="https://github.com/keystonejs/keystone"
					/>
				</div>
			</header>
		);
	}
}

const styles = {
	navBar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "white",
		height: "3rem",
		[theme.breakpoint.smallOnly]: {
			flexWrap: "wrap",
			height: "auto"
		}
	},
	navBarSide: {
		height: "3rem",
		display: "flex",
		alignItems: "center",
		position: "absolute",
		top: 0
	},
	navBarSideLeft: {
		left: 0,
		[theme.breakpoint.mediumDown]: {
			left: "2rem"
		}
	},
	navBarSideRight: {
		right: 0,
		[theme.breakpoint.mediumDown]: {
			right: "2rem"
		}
	},
	navBarCenter: {
		flex: 1,
		listStyle: "none",
		margin: 0,
		padding: 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",

		[theme.breakpoint.smallOnly]: {
			height: "3.75rem",
			alignItems: "flex-start",
			marginTop: "4rem",
			flexWrap: "noWrap",
			overflowX: "scroll",
			overflowY: "hidden",
			marginLeft: "-2rem",
			marginRight: "-2rem",
			padding: "0 2rem",
			justifyContent: "flex-start",
			webkitOverflowScrolling: "touch"
		}
	},
	navItem: {
		margin: "0 0.625em",
		padding: 0,
		lineHeight: 1.4,

		[theme.breakpoint.smallOnly]: {
			margin: "0 1.25rem 0 0",
			fontSize: "1.15rem"
		}
	},
	navItemLink: {
		color: "inherit",
		opacity: 0.75,
		textDecoration: "none",
		whiteSpace: "noWrap",
		":hover": {
			opacity: 1
		}
	},
	logo: {
		height: "3rem",
		margin: "0 1rem 0 0"
	},
	logoText: {
		fontSize: "1.3em"
	}
};
