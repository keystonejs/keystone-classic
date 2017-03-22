import React, { Component } from 'react';
import Container from '../../../components/Container';
import Link from 'gatsby-link';
import { Col, Row } from '../../../components/Grid';

export default class ValueProps extends Component {
	render () {
		return (
			<Container>
				<Row medium="1" large="1/2">
					<Col>
						<h3><Link to="">Get Started →</Link></h3>
						<p>Sound like what you've been looking for? Check out the getting started guide and learn how to get up and running in less than a minute.</p>
					</Col>
					<Col>
						<h3><Link to="">Get In Touch →</Link></h3>
						<p>If you are using Keystone for a project, interested in contributing, or looking for commercial support, we'd love to hear about it. Please contact us.</p>
					</Col>
				</Row>
			</Container>
		);
	}
};
