import React, { Component } from 'react';
import Link from 'gatsby-link';
import { rhythm } from 'utils/typography';
import { compose } from 'glamor';

import Container from '../components/Container';
import { Col, Row } from '../components/Grid';
import theme from '../theme';

import ValueProp from './components/home/header/ValueProp';

export default class HomePage extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container>
					<div className={compose(styles.intro)}>
						<h1 className={compose(styles.intro__title)}>Node.js CMS & web app platform</h1>
						<p className={compose(styles.intro__lead)}>Keystone is an open source framework for developing database-driven websites, applications and APIs in Node.js. Built on Express and MongoDB.</p>
					</div>
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
					<p>How about <strong><Link to="/introduction/getting-started" style={{ color: 'white' }}>some docs</Link></strong>, because the homepage is a work in progress?</p>
				</Container>
			</div>
		);
	}
};

const styles = {
	wrapper: {
		backgroundColor: theme.color.blue,
		color: 'white',
	},

	// intro
	intro: {
		paddingBottom: rhythm(2),
		paddingTop: rhythm(2),
		textAlign: 'center',
	},
	intro__title: {
		color: 'inherit',
		fontSize: '3em',
		fontWeight: '200',
		marginBottom: '1em',
	},
	intro__lead: {
		color: 'inherit',
		fontSize: '1.2em',
		fontWeight: '300',
		opacity: '0.7',
	},
};
