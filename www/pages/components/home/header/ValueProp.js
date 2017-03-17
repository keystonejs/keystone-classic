import React, { PropTypes } from 'react';
import { compose } from 'glamor';

import theme from '../../../../theme';

export default function ValueProp ({ icon, text, title }) {
	return (
		<div {...compose(styles.base)}>
			<i {...compose(styles.icon)}>{icon}</i>
			<div {...compose(styles.content)}>
				<h3 {...compose(styles.title)}>{title}</h3>
				<p {...compose(styles.text)}>{text}</p>
			</div>
		</div>
	);
};

ValueProp.propTypes = {
	icon: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

const styles = {
	base: {
		alignItems: 'center',
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
		fontWeight: '300',
	},
	text: {
		fontWeight: '300',
		opacity: '0.7',
	},
};
