import React, { Component } from 'react';
import Container from '../../components/Container';
import { compose } from 'glamor';
import Link from 'gatsby-link';
import Header from '../../components/Header';
import theme from '../../theme';
import Footer from './components/home/Footer';

const Body = () => (
	<div className={compose(styles.content)}>
		<h1 className={compose(styles.heading)}>Whoops! Nothing to see here.</h1>
		<p className={compose(styles.subHeading)}>
			Something should have been here, but apparently it's not. No worries, here are a couple of helpful links that will get you on your way!
		</p>
		<div className={compose(styles.buttons)}>
			<Link
				to="/getting-started"
				className={compose(
					styles.button,
					styles.buttonPrimary
				)}>
				Get started
			</Link>
			<a
				href="http://demo.keystonejs.com/"
				className={compose(
					styles.button,
					styles.buttonSecondary
				)}
				target="_blank">
				Documentation
			</a>
		</div>
	</div>
);

export default class extends Component {
	render () {
		return (
			<div>
				<div className={compose(styles.wrapper)}>
					<Container>
						<Header />
						<Body />
					</Container>
				</div>
				<Footer />
			</div>
        );
	}
}

const styles = {
	wrapper: {
		background: 'linear-gradient(145deg, #00c1da, #003bca)',
		color: 'white',
		padding: '2rem 0 4em',
		position: 'relative',
		width: '100vw',
		height: '100vh',
		overflow: 'hidden'
	},
	content: {
		padding: '8em 0 0',
		textAlign: 'center',
		margin: 'auto',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '80%',

		[theme.breakpoint.mediumDown]: {
			width: '100%',
			padding: '4rem 0rem 0',
		},
	},
	heading: {
		color: 'white',
		fontSize: '3rem',
		[theme.breakpoint.mediumDown]: {
			fontSize: '2.5rem',
		},
	},
	subHeading: {
		fontSize: '1.25rem',
		opacity: 0.8,
	},
	buttons: {
		display: 'inline-flex',
		marginTop: '1.25rem',
		alignItems: 'center',
	},
	button: {
		background: 'white',
		color: theme.color.blue,
		textDecoration: 'none',
		fontSize: '1.25rem',
		padding: '1rem 2rem',
		borderRadius: 6,
		transition: 'transform linear 120ms',
		':hover': {
			transform: 'scale(1.025)',
		},
		':active': {
			opacity: 0.8,
		},
	},
	buttonPrimary: {
		textTransform: 'uppercase',
		fontWeight: '500',
	},
	buttonSecondary: {
		display: 'flex',
		background: 'none',
		color: 'white',
		fontSize: '1.25rem',
		border: '2px solid rgba(255,255,255,0.4)',
		marginLeft: '1rem',
	},
};
