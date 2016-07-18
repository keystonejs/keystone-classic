import { StyleSheet, css } from 'aphrodite';
import classnames from 'classnames';
import React, { PropTypes } from 'react';
import styles from './styles';

const classes = StyleSheet.create(styles);

const BUTTON_SIZES = ['large', 'medium', 'small', 'xsmall'];
const BUTTON_KINDS = [
	'default',
	'default-primary',
	'default-success',
	'default-warning',
	'default-danger',
	'hollow-primary',
	'hollow-success',
	'hollow-warning',
	'hollow-danger',
	'primary',
	'success',
	'warning',
	'danger',
	'link',
	'link-text',
	'link-primary',
	'link-success',
	'link-warning',
	'link-danger',
	'link-cancel',
	'link-delete',
];

const Button = (props) => {
	let consumedProps = Object.assign({}, props, {
		className: classnames(css(classes.button), {
			[css(classes.layout__block)]: props.block,
			[css(classes.layout__disabled)]: props.disabled,
			[css(classes['kind__' + props.kind])]: props.kind,
			[css(classes['size__' + props.size])]: props.size,
			[css(classes['is-active'])]: props.isActive,
		}, props.className),
	});
	delete consumedProps.block;
	delete consumedProps.isActive;
	delete consumedProps.kind;
	delete consumedProps.size;

	// return the given component if provided
	if (props.component) {
		return React.cloneElement(props.component, consumedProps);
	}

	// return an anchor or button
	const node = props.href ? 'a' : 'button';
	if (node !== 'button') {
		delete consumedProps.type;
	}
	return React.createElement(node, consumedProps);
};

Button.propTypes = {
	block: PropTypes.bool,
	className: PropTypes.string,
	component: PropTypes.element,
	href: PropTypes.string,
	isActive: PropTypes.bool,
	kind: PropTypes.oneOf(BUTTON_KINDS),
	size: PropTypes.oneOf(BUTTON_SIZES),
	type: PropTypes.oneOf(['button', 'submit']),
};
Button.defaultProps = {
	kind: 'default',
	type: 'button',
};

module.exports = Button;
