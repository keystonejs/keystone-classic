/**
 * The global Footer, displays a link to the website and the current Keystone
 * version in use
 */

import React from "react";
import { css } from "glamor";
import { Container } from "../../elemental";
import theme from "../../../theme";

var Footer = React.createClass({
	displayName: "Footer",
	propTypes: {
		appversion: React.PropTypes.string,
		backUrl: React.PropTypes.string,
		brand: React.PropTypes.string,
		user: React.PropTypes.object,
		User: React.PropTypes.object, // eslint-disable-line react/sort-prop-types
		version: React.PropTypes.string
	},
	// Render the user
	renderUser() {
		const { User, user } = this.props;
		if (!user) return null;

		return (
			<span>
				<span> Signed in as </span>
				<a
					href={`${Keystone.adminPath}/${User.path}/${user.id}`}
					tabIndex="-1"
					className={css(classes.link)}
				>
					{user.name}
				</a>
				<span>.</span>
			</span>
		);
	},
	render() {
		const { backUrl, brand, appversion, version } = this.props;

		return (
			<footer className={css(classes.footer)} data-keystone-footer>
				<Container>
					<a href={backUrl} tabIndex="-1" className={css(classes.link)}>
						{brand + (appversion ? " " + appversion : "")}
					</a>
					<span> powered by </span>
					<a
						href="http://v4.keystonejs.com"
						target="_blank"
						className={css(classes.link)}
						tabIndex="-1"
					>
						KeystoneJS
					</a>
					<span> version {version}.</span>
					{this.renderUser()}
				</Container>
			</footer>
		);
	}
});

/* eslint quote-props: ["error", "as-needed"] */
const linkHoverAndFocus = {
	color: theme.color.gray60,
	outline: "none"
};
const classes = {
	footer: {
		boxShadow: "0 -1px 0 rgba(0, 0, 0, 0.1)",
		color: theme.color.gray40,
		fontSize: theme.font.size.small,
		paddingBottom: 30,
		paddingTop: 40,
		textAlign: "center"
	},
	link: {
		color: theme.color.gray60,

		":hover": linkHoverAndFocus,
		":focus": linkHoverAndFocus
	}
};

module.exports = Footer;
