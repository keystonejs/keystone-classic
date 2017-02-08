import React, { Component, PropTypes } from 'react';
import vkey from 'vkey';

class AltText extends Component {
	constructor () {
		super();

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);

		this.state = {
			modified: false,
		};
	}
	componentDidMount () {
		document.body.addEventListener('keydown', this.handleKeyDown, false);
		document.body.addEventListener('keyup', this.handleKeyUp, false);
	}
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	}
	handleKeyDown (e) {
		if (vkey[e.keyCode] !== this.props.modifier) return;
		this.setState({
			modified: true,
		});
	}
	handleKeyUp (e) {
		if (vkey[e.keyCode] !== this.props.modifier) return;
		this.setState({
			modified: false,
		});
	}
	render () {
		// NOTE `modifier` is declared to remove it from `props`, though never used
		const {
			component: Component,
			modified,
			modifier, // eslint-disable-line no-unused-vars
			normal,
			...props
		} = this.props;

		props.children = this.state.modified
			? modified
			: normal;

		return <Component {...props} />;
	}
};

const SUPPORTED_KEYS = [
	'<alt>',
	'<control>',
	'<meta>',
	'<shift>',
];

AltText.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	modified: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]),
	modifier: PropTypes.oneOf(SUPPORTED_KEYS),
	normal: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]),
};
AltText.defaultProps = {
	component: 'span',
	modifier: '<alt>',
};

module.exports = AltText;
