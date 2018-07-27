import React, { Component } from 'react';
import React from 'react';
import Container from '../../../../components/Container';
import { compose } from 'glamor';
import Link from 'gatsby-link';
import Header from '../../../../components/Header';
import theme from '../../../../theme';

/*
import WhereNext from './components/home/WhereNext';
import Footer from './components/home/Footer';

const Intro = () => (
	<div className={compose(styles.content)}>
		<h1 className={compose(styles.heading)}>Whoops</h1>
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
				Try the demo
			</a>
		</div>
	</div>
);

class Hero extends Component {
    render(){
        return(
            <div className={compose(styles.wrapper)}>
                <Container>
                    <Header />
                    <Intro />
                </Container>
            </div>
        )
    }
}
*/

export default class NotFound extends Component {
	render () {
		/*return (
			<div>
				<Hero />
				<WhereNext />
				<Footer />
			</div>
        );*/
        return (
            <div>Not found</div>
        )
	}
}

const styles = {
	wrapper: {
		background: 'linear-gradient(145deg, #00c1da, #003bca)',
		color: 'white',
		padding: '2rem 0 4em',
		position: 'relative',
		width: '100vw',
		overflow: 'hidden',
	},
	content: {
		padding: '6em 0 0',
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
