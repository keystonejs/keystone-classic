import classnames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import styles from './styles';

const classes = StyleSheet.create(styles);

class FormNote extends Component {
	render () {
		const { className, component } = this.props;
		const consumedProps = {
			...this.props,
			className: classnames(css(classes.FormNote), className),
		};

		return React.createElement(component, consumedProps);
	}
};
FormNote.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
};
FormNote.defaultProps = {
	component: 'div',
};

module.exports = FormNote;
