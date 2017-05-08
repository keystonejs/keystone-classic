import React, { Component } from 'react';
import Container from '../../../components/Container';
import { Col, Row } from '../../../components/Grid';
import { compose } from 'glamor';
import theme from '../../../theme';

import {
	EntypoLeaf,
	EntypoShuffle,
	EntypoImages,
	EntypoLightBulb,
	EntypoPencil,
	EntypoDocument,
	EntypoUsers,
	EntypoPaperPlane,
} from 'react-entypo';

const ValueProp = ({ icon, text, title, text2, marginTop }) => {
	return (
		<div {...compose(styles.base, { marginTop })}>
			<i {...compose(styles.icon_inner)}>{icon}</i>
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
			<Container style={styles.container}>
				<div className={compose(styles.preamble)}>
					<h2 className={compose(styles.heading)}>Get a head-start on the features you need</h2>
					<p className={compose(styles.subheading)}>KeystoneJS is the easiest way to build database-driven websites, applications and APIs in Node.js.</p>
				</div>
				<Row medium="1" large="1/2">
					<Col>
						<ValueProp
							title="Express.js and MongoDB"
							text="Keystone will configure express - the de facto web server for node.js - for you and connect to your MongoDB database using Mongoose, the leading ODM package."
							icon={<EntypoLeaf style={styles.icon} />}
						/>
					</Col>
					<Col>
						<ValueProp
							title="Dynamic Routes"
							text="Keystone starts with best practices for setting up your MV* application, and makes it easy to manage your templates, views and routes."
							icon={<EntypoShuffle style={styles.icon} />}
						/>
					</Col>
				</Row>
				<Row medium="1" large="1/2">
					<Col>
						<ValueProp
							title="Database Fields"
							text="IDs, Strings, Booleans, Dates and Numbers are the building blocks of your database. Keystone builds on these with useful, real-world field types like name, email, password, address, image and relationship fields (and more)"
							icon={<EntypoImages style={styles.icon} />}
						/>
					</Col>
					<Col>
						<ValueProp
							title="Auto-generated Admin UI"
							text="Whether you use it while you're building out your application, or in production as a database content management system, Keystone's Admin UI will save you time and make managing your data easy."
							icon={<EntypoLightBulb style={styles.icon} />}
						/>
					</Col>
				</Row>
				<Row medium="1" large="1/2">
					<Col>
						<ValueProp
							title="Simpler Code"
							text="Sometimes, async code can get complicated to do simple things. Keystone helps keep simple things - like loading data before displaying it in a view - simple."
							icon={<EntypoPencil style={styles.icon} />}
						/>
					</Col>
					<Col>
						<ValueProp
							title="Form Processing"
							text="Want to validate a form, upload an image, and update your database with a single line? Keystone can do that, based on the data models you've already defined."
							icon={<EntypoDocument style={styles.icon} />}
						/>
					</Col>
				</Row>
				<Row medium="1" large="1/2">
					<Col>
						<ValueProp
							title="Session Management"
							text="Keystone comes ready out of the box with session management and authentication features, including automatic encryption for password fields."
							icon={<EntypoUsers style={styles.icon} />}
						/>
					</Col>
					<Col>
						<ValueProp
							title="Email Sending"
							text="Keystone makes it easy to set up, preview and send template-based emails for your application. It also integrates with Mandrill (Mailchimp's excellent transaction email sending service)"
							icon={<EntypoPaperPlane style={styles.icon} />}
						/>
					</Col>
				</Row>
			</Container>
		);
	}
};

const styles = {
	container: { borderBottom: `1px solid ${theme.color.gray10}` },
	icon: {
		width: '30px',
		height: '30px',
		fill: theme.color.blue,
	},
	preamble: {
		textAlign: 'center',
	},
	heading: {
		fontSize: '2.6em',
	},
	subheading: {
		fontSize: '1.8em',
		lineHeight: '1.2em',
		color: theme.color.gray40,
	},
	base: {
		display: 'flex',
	},
	content: {
		flexGrow: 1,
	},
	icon_inner: {
		marginRight: '1em',
	},
	title: {
		color: 'inherit',
		fontWeight: '400',
		marginTop: '0.2em',
	},
	text: {
		paddingTop: '1em',
		fontWeight: '300',
	},
};
