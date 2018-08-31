import React, { Component } from 'react';
import { compose } from 'glamor';
import Link from 'gatsby-link';
import Container from '../../../../components/Container';
import { Col, Row } from '../../../../components/Grid';
import { color } from '../../../../theme';

export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container>
					<Row medium="1/2" large="1/2">
						<Col>
							<Link to="/getting-started" className={compose(styles.card)}>
								<h3 className={compose(styles.next__heading)}>Get Started →</h3>
								<p className={compose(styles.next__text)}>
									Sound like what you've been looking for? Check out the getting started guide and learn how to get up and running in less than a minute.
								</p>
							</Link>
						</Col>
						<Col>
							<a href="mailto:contact@keystonejs.com" className={compose(styles.card)}>
								<h3 className={compose(styles.next__heading)}>Get In Touch →</h3>
								<p className={compose(styles.next__text)}>
									If you are using Keystone for a project, interested in contributing, or looking for commercial support, we'd love to hear about it. Please contact us.
								</p>
							</a>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
};

const styles = {
	wrapper: {
		paddingTop: '4em',
		paddingBottom: '6em',
	},
	card: {
		padding: '2rem',
		margin: '1rem 0',
		borderRadius: 8,
		boxShadow: '0px 0px 10px rgba(0,0,0,0.15)',
		display: 'block',
		textDecoration: 'none',
		transition: 'all linear 150ms',
		':hover': {
			transform: 'scale(1.02)',
		},
	},
	next__heading: {
		fontSize: '1.6em',
		textDecoration: 'none',
		margin: 0,
	},
	next__text: {
		fontSize: '1rem',
		color: color.gray50,
		margin: '1rem 0 0',
	},
};
