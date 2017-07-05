import { css } from 'glamor';
import React, { Component, PropTypes } from 'react';
import classes from './styles';

class Form extends Component {
	getChildContext () {
		return {
			formLayout: this.props.layout,
			labelWidth: this.props.labelWidth,
		};
	}
	render () {
		// NOTE `labelWidth` is declared to remove it from `props`, though never used
		const {
			className,
			component: Component,
			labelWidth, // eslint-disable-line no-unused-vars
			layout,
			...props
		} = this.props;

		props.className = css(
			classes.Form,
			classes['Form__' + layout],
			className
		);

		return <Component {...props} />;
	}
};

Form.childContextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	labelWidth: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};
Form.propTypes = {
	children: PropTypes.node.isRequired,
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	layout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
};
Form.defaultProps = {
	component: 'form',
	layout: 'basic',
};

module.exports = Form;
