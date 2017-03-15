import React, { Component } from 'react';
import Link from 'gatsby-link';

import Container from '../components/Container';
import { Col, Row } from '../components/Grid';

function ValueProp ({ icon, text, title }) {
	return (
		<div>
			<i>{icon}</i>
			<h3>{title}</h3>
			<p>{text}</p>
		</div>
	);
};

export default class HomePage extends Component {
	render () {
		return (
			<Container>
				<h1>Node.js CMS & web app platform</h1>
				<p>Keystone is an open source framework for developing database-driven websites, applications and APIs in Node.js. Built on Express and MongoDB.</p>
				<Row medium="1/2" large="1/4">
					<Col>
						<ValueProp
							title="Light & Flexible"
							text="Get a head-start on the features you need"
							icon="icon"
						/>
					</Col>
					<Col>
						<ValueProp
							title="Light & Flexible"
							text="Get a head-start on the features you need"
							icon="icon"
						/>
					</Col>
					<Col>
						<ValueProp
							title="Light & Flexible"
							text="Get a head-start on the features you need"
							icon="icon"
						/>
					</Col>
					<Col>
						<ValueProp
							title="Light & Flexible"
							text="Get a head-start on the features you need"
							icon="icon"
						/>
					</Col>
				</Row>
				<hr />
				<p>How about <strong><Link to="/guides/getting-started">some docs</Link></strong>, because the homepage is a work in progress?</p>
			</Container>
		);
	}
};
