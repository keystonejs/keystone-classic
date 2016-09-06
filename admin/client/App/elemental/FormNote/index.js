import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import styles from './styles';

const classes = StyleSheet.create(styles);

function FormNote ({ className, children, component: Component, ...props }) {
	props.className = css(classes.note, className);

	return (
		<Component {...props} dangerouslySetInnerHTML={{ __html: children }} />
	);
};
FormNote.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};
FormNote.defaultProps = {
	component: 'div',
};

module.exports = FormNote;
