import React, { Component } from 'react';
import Container from '../../../../components/Container';
import { Col, Row } from '../../../../components/Grid';
import { compose } from 'glamor';
import theme from '../../../../theme';

import {
	EntypoLeaf,
	EntypoShuffle,
	EntypoImages,
	EntypoLightBulb,
	EntypoPencil,
	EntypoDocuments,
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
	marginTop: '3em',
};


export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.wrap)}>
				<Container>
					<div className={compose(styles.preamble)}>
						<h2 className={compose(styles.heading)}>Get a head-start on the features you need</h2>
						<p className={compose(styles.subheading)}>KeystoneJS is the easiest way to build database-driven websites, applications and APIs in Node.js.</p>
					</div>
					<Row medium="1/2" large="1/4">
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
					<Row medium="1/2" large="1/4">
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
								icon={<EntypoDocuments style={styles.icon} />}
							/>
						</Col>
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
			</div>
		);
	}
};

const styles = {
	wrap: {
		padding: '4rem 0',
		borderBottom: `1px solid ${theme.color.gray05}`,
	},
	icon: {
		width: '42px',
		height: '42px',
		fill: theme.color.blue,
	},
	preamble: {
		textAlign: 'center',
	},
	heading: {
		fontSize: '2em',
	},
	subheading: {
		fontSize: '1.25em',
		color: theme.color.gray50,
	},
	base: {
		display: 'flex',
		flexDirection: 'column',
	},
	content: {
		flexGrow: 1,
	},
	title: {
		color: 'inherit',
		margin: '1.25rem 0 0',
	},
	text: {
		margin: '1rem 0 0',
	},
};
