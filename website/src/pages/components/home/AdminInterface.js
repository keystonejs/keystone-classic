import React, { Component } from 'react';
import Container from '../../../../components/Container';
import theme from '../../../../theme';
import { compose } from 'glamor';
import adminView from '../../../../images/keystone_admin.png';

export default class ValueProps extends Component {
	render () {
		return (
			<div className={compose(styles.wrapper)}>
				<Container>
					<h2 className={compose(styles.heading)}>Admin Interface</h2>
					<p className={compose(styles.subheading)}>
						Keystone gives you a beautiful, customisable Admin UI based on your
						models
					</p>
					<img src={adminView} className={compose(styles.image)} />
				</Container>
			</div>
		);
	}
}

const styles = {
	wrapper: {
		backgroundColor: theme.color.lightBlue,
		textAlign: 'center',
		padding: '4rem 0',
		width: '100vw',
		overflow: 'hidden',
	},
	heading: {
		fontSize: '2em',
	},
	subheading: {
		fontSize: '1.25em',
		color: theme.color.gray50,
	},
	image: {
		margin: '3rem 0 0',
		display: 'block',
	},

};
