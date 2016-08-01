import { StyleSheet, css } from 'aphrodite/no-important';
import blacklist from 'blacklist';
import classnames from 'classnames';
import React, { Component, PropTypes } from 'react';
import styles from './styles';

const classes = StyleSheet.create(styles);

class Form extends Component {
	getChildContext () {
		return {
			formLayout: this.props.layout,
		};
	}
	render () {
		const { className, component, layout } = this.props;

		const componentClass = classnames(
			css(classes.Form),
			css(classes['Form__' + layout]),
			className
		);
		const consumedProps = blacklist(this.props, 'className', 'component', 'layout');
		consumedProps.className = componentClass;

		return React.createElement(component, consumedProps);
	}
};

Form.childContextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
};
Form.propTypes = {
	children: PropTypes.node.isRequired,
	component: PropTypes.node,
	layout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
};
Form.defaultProps = {
	component: 'form',
	layout: 'basic',
};

module.exports = Form;
