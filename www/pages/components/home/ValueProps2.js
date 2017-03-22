import React, { Component } from 'react';
import Container from '../../../components/Container';
import { Col, Row } from '../../../components/Grid';
import ValueProp from './header/ValueProp';
import theme from '../../../theme';
import { compose } from 'glamor';
import { EntypoTools } from 'react-entypo';

export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container>
					<h2>What you build is up to you.</h2>
					<p>There are a lot of frameworks that make decisions for you, and many that take decisions away. Keystone doesn't do that. Use the features that suit you, and replace the ones that don't.</p>
					<EntypoTools />
					<Row medium="1" large="1/2">
						<Col>
							<ValueProp
								title="Built on Express"
								text="Keystone can configure Express for you, or you can take over and treat Keystone like any other Express middleware.\nYou can also easily integrate it into an existing Express app."
							/>
						</Col>
						<Col>
							<ValueProp
								title="Powered by MongoDB"
								text="Keystone uses Mongoose, the leading ODM for node.js and MongoDB, and gives you a single place for your schema, validation rules and logic.\nSo anything you can build with MongoDB, you can build with Keystone."
							/>
						</Col>
					</Row>
					<Row medium="1" large="1/2">
						<Col>
							<ValueProp
								title="Lightweight and flexible"
								text="Keystone is designed to be as light as you want - you can pick and choose the features you want to include.\nCreate your own routes, your own database schema, and use any template language you like."
							/>
						</Col>
						<Col>
							<ValueProp
								title="Extendable"
								text="One of the greatest things about node.js is the vast number of quality packages available.\nKeystone is designed to let you use any of them, without losing the benefits it provides."
							/>
						</Col>
					</Row>
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
};
