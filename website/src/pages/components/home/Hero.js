import React from "react";
import Container from "../../../../components/Container";
import { compose } from "glamor";
import Link from "gatsby-link";
import Header from "../../../../components/Header";
import { version } from "../../../../../package.json";
import theme from "../../../../theme";

import continental from "../../../../images/brand-continental.png";
import event_cinemas from "../../../../images/brand-event_cinemas.png";
import macmillan from "../../../../images/brand-macmillan.png";
import sony from "../../../../images/brand-sony.png";
import vodafone from "../../../../images/brand-vodafone.png";
import westpac from "../../../../images/brand-westpac.png";

export default () => (
	<div className={compose(styles.wrapper)}>
		<Container>
			<Header />
			<Intro />
			<Projects />
		</Container>
	</div>
);

const Intro = () => (
	<div className={compose(styles.content)}>
		<h1 className={compose(styles.heading)}>Node.js CMS & web app platform</h1>
		<p className={compose(styles.subHeading)}>
			KeystoneJS is an open source framework for developing database-driven
			websites, applications and APIs in Node.js. Built on Express and MongoDB.
		</p>
		<div className={compose(styles.buttons)}>
			<Link
				to="/getting-started"
				className={compose(
					styles.button,
					styles.buttonPrimary
				)}
			>
				Get started
			</Link>
			<a
				href="http://demo.keystonejs.com/"
				className={compose(
					styles.button,
					styles.buttonSecondary
				)}
				target="_blank"
			>
				Try the demo
			</a>
		</div>
		<LatestRelease />
	</div>
);

const LatestRelease = () => (
	<div className={compose(styles.release)}>
		<span className={compose(styles.dot)} />
		<span className={compose(styles.releaseMain)}>
			Latest release: <strong>{version}</strong>
		</span>
		<span className={compose(styles.releaseSide)}>
			<a
				href="https://github.com/keystonejs/keystone/releases/"
				style={{ color: "white" }}
				target="_blank"
			>
				See what's new
			</a>
		</span>
	</div>
);

const Projects = () => (
	<div className={compose(styles.projects)}>
		<h6 className={compose(styles.projectsTitle)}>
			Keystone powers websites, apps and APIs for:
		</h6>
		<div className={compose(styles.projectLogos)}>
			<img src={continental} className={compose(styles.projectLogo)} />
			<img src={westpac} className={compose(styles.projectLogo)} />
			<img src={sony} className={compose(styles.projectLogo)} />
			<img src={event_cinemas} className={compose(styles.projectLogo)} />
			<img src={vodafone} className={compose(styles.projectLogo)} />
			<img src={macmillan} className={compose(styles.projectLogo)} />
		</div>
	</div>
);

const styles = {
	wrapper: {
		background: "linear-gradient(145deg, #00c1da, #003bca)",
		color: "white",
		padding: "2rem 0 4em",
		position: "relative",
		width: "100vw",
		overflow: "hidden"
	},
	content: {
		padding: "6em 0 0",
		textAlign: "center",
		margin: "auto",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: "80%",

		[theme.breakpoint.mediumDown]: {
			width: "100%",
			padding: "4rem 0rem 0"
		}
	},
	heading: {
		color: "white",
		fontSize: "3rem",
		[theme.breakpoint.mediumDown]: {
			fontSize: "2.5rem"
		}
	},
	subHeading: {
		fontSize: "1.25rem",
		opacity: 0.8
	},
	buttons: {
		display: "inline-flex",
		marginTop: "1.25rem",
		alignItems: "center"
	},
	button: {
		background: "white",
		color: theme.color.blue,
		textDecoration: "none",
		fontSize: "1.25rem",
		padding: "1rem 2rem",
		borderRadius: 6,
		transition: "transform linear 120ms",
		":hover": {
			transform: "scale(1.025)"
		},
		":active": {
			opacity: 0.8
		}
	},
	buttonPrimary: {
		textTransform: "uppercase",
		fontWeight: "500"
	},
	buttonSecondary: {
		display: "flex",
		background: "none",
		color: "white",
		fontSize: "1.25rem",
		border: "2px solid rgba(255,255,255,0.4)",
		marginLeft: "1rem"
	},

	release: {
		fontSize: "1rem",
		padding: "0.625rem 1rem",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.1)",
		borderRadius: 6,
		margin: "3rem auto 0"
	},

	dot: {
		width: 10,
		height: 10,
		borderRadius: "50%",
		marginRight: "0.625rem",
		backgroundColor: theme.color.green
	},

	releaseSide: {
		marginLeft: "1.25rem"
	},

	projects: {
		margin: "3rem auto 0",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center"
	},

	projectsTitle: {
		fontSize: "1rem",
		fontWeight: "300",
		color: "rgba(255,255,255,0.75)"
	},

	projectLogos: {
		display: "flex",
		alignSelf: "stretch",
		margin: "1rem 0 0",
		alignItems: "center",
		justifyContent: "space-between",
		position: "relative",
		[theme.breakpoint.mediumDown]: {
			flexWrap: "wrap",
			justifyContent: "center"
		}
	},

	projectLogo: {
		[theme.breakpoint.smallOnly]: {
			width: "28%",
			margin: "2.5%"
		},
		[theme.breakpoint.mediumUp]: {
			width: "20%",
			margin: "2.5%"
		}
	}
};
