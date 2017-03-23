import React, { PropTypes } from 'react';
import { compose } from 'glamor';

export default function ValueProp ({ icon, text, title, text2, marginTop }) {
	return (
		<div {...compose(styles.base, { marginTop })}>
			<i {...compose(styles.icon)}>{icon}</i>
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

ValueProp.propTypes = {
	text: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

const styles = {
	base: {
		display: 'flex',
		marginTop: '4em',
	},
	content: {
		flexGrow: 1,
	},
	icon: {
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
