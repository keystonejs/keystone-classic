import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import styles from './styles';

const classes = StyleSheet.create(styles);

function FormNote ({
	className,
	children,
	component: Component,
	html,
	...props
}) {
	props.className = css(classes.note, className);

	// Property Violation
	if (children && html) {
		console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
	}

	return html ? (
		<Component {...props} dangerouslySetInnerHTML={{ __html: html }} />
	) : (
		<Component {...props}>{children}</Component>
	);
};
FormNote.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	html: PropTypes.string,
};
FormNote.defaultProps = {
	component: 'div',
};

module.exports = FormNote;
