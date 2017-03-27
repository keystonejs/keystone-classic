import React, { Component } from 'react';
import Container from '../../../components/Container';
import Link from 'gatsby-link';
import { Col, Row } from '../../../components/Grid';
import { compose } from 'glamor';

export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container>
					<Row medium="1" large="1/2">
						<Col className={compose(styles.col)}>
							<h3><Link to="/getting-started" className={compose(styles.next__heading)}>Get Started →</Link></h3>
							<p className={compose(styles.next__text)}>Sound like what you've been looking for? Check out the getting started guide and learn how to get up and running in less than a minute.</p>
						</Col>
						<Col className={compose(styles.col)}>
							<h3><a href="mailto:contact@keystonejs.com" className={compose(styles.next__heading)}>Get In Touch →</a></h3>
							<p className={compose(styles.next__text)}>If you are using Keystone for a project, interested in contributing, or looking for commercial support, we'd love to hear about it. Please contact us.</p>
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
	next__heading: {
		fontSize: '1.6em',
		textDecoration: 'none',
	},
	next__text: {
		marginTop: '0.5em',
		fontSize: '1.6em',
		lineHeight: '1.4',
		fontWeight: '200',
	},
	col: {
		paddingRight: '5em',
	},
};
