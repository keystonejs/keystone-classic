import React, { Component } from 'react';
import Container from '../../../components/Container';
import theme from '../../../theme';
import { compose } from 'glamor';
import adminView from '../../../images/keystone_admin.png';


export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container style={{ paddingBottom: '0' }}>
					<h2 className={compose(styles.heading)}>Admin Interface</h2>
					<p className={compose(styles.subheading)}>Keystone gives you a beautiful, customisable Admin UI based on your models</p>
					<img src={adminView} className={compose(styles.image)} />
				</Container>
			</div>
		);
	}
};

const styles = {
	wrapper: {
		backgroundColor: theme.color.lightBlue,
		textAlign: 'center',
	},
	heading: {
		paddingTop: '3em',
		fontSize: '2.6em',
	},
	image: {
		marginBottom: '0',
		display: 'block',
	},
	subheading: {
		paddingTop: '1em',
		fontSize: '1.8em',
		lineHeight: '1.2em',
		paddingBottom: '1em',
	},
};
