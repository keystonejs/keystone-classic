import React, { Component } from 'react';
import Container from '../../../../components/Container';
import { Col, Row } from '../../../../components/Grid';
import theme from '../../../../theme';
import { compose } from 'glamor';
import { EntypoTools } from 'react-entypo';

const ValueProp = ({ icon, text, title, text2, marginTop }) => {
	return (
		<div {...compose(styles.base, { marginTop })}>
			{icon && <i {...compose(styles.icon)}>{icon}</i>}
			<div {...compose(styles.content)}>
				<h3 {...compose(styles.title)}>{title}</h3>
				<p {...compose(styles.text)}>{text}</p>
				{text2
					? <p {...compose(styles.text)}>{text2}</p>
					: null}
			</div>
		</div>
	);
};

ValueProp.defaultProps = {
	marginTop: '4em',
};

export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container>
					<div className={compose(styles.intro)}>
						<h2 className={compose(styles.heading)}>What you build is up to you.</h2>
						<p className={compose(styles.subheading)}>There are a lot of frameworks that make decisions for you, and many that take decisions away.<br />Keystone doesn't do that. Use the features that suit you, and replace the ones that don't.</p>
					</div>
					<div className={compose(styles.divider)}>
						<span className={compose(styles.dividerLine)} />
						<EntypoTools style={{ width: '60px', height: '60px', margin: '0 2rem' }} />
						<span className={compose(styles.dividerLine)} />
					</div>
					<Row small="1" medium="1/2" large="1/4">
						<Col>
							<ValueProp
								title="Built on Express"
								text="Keystone can configure Express for you, or you can take over and treat Keystone like any other Express middleware."
								text2="You can also easily integrate it into an existing Express app."
								marginTop="1em"
							/>
						</Col>
						<Col>
							<ValueProp
								title="Powered by MongoDB"
								text="Keystone uses Mongoose, the leading ODM for Node.js and MongoDB, and gives you a single place for your schema, validation rules, and logic."
								text2="Anything you can build with MongoDB, you can build with Keystone."
								marginTop="1em"
							/>
						</Col>
						<Col>
							<ValueProp
								title="Lightweight and flexible"
								text="Keystone is designed to be as light as you want - you can pick and choose the features you want to include."
								text2="Create your own routes, your own database schema, and use any template language you like."
								marginTop="1em"
							/>
						</Col>
						<Col>
							<ValueProp
								title="Extendable"
								text="One of the greatest things about Node.js is the vast number of quality packages available."
								text2="Keystone is designed to let you use any of them without losing the benefits they provide."
								marginTop="1em"
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
		padding: '4rem 0',
	},
	intro: {
		textAlign: 'center',
	},
	heading: {
		fontSize: '2em',
		color: 'inherit',
	},
	subheading: {
		fontSize: '1.25em',
		color: 'rgba(255,255,255,0.75)',
	},
	divider: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '3rem 0',
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: 'rgba(255,255,255,0.1)',
	},
	base: {
		display: 'flex',
	},
	content: {
		flexGrow: 1,
	},
	icon: {
		marginRight: '1em',
	},
	title: {
		color: 'inherit',
		margin: 0,
	},
	text: {
		marginTop: '1rem',
	},
	cloud: {
		width: '200px',
		height: '170px',
		color: theme.color.blue,
		marginTop: '-170px',
		position: 'absolute',
		right: '8%',
	},
	rocket: {
		width: '137px',
		height: '140px',
		color: theme.color.blue,
		marginTop: '-220px',
		position: 'absolute',
		left: '8%',
	},
};
