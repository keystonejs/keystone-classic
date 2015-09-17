import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';
import Color from 'color';
import E from '../constants';

var Checkbox = React.createClass({
	displayName: 'Checkbox',
	propTypes: {
		checked: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		readonly: React.PropTypes.bool,
	},
	getDefaultProps () {
		return {
			component: 'button',
		};
	},
	getInitialState () {
		return {
			active: null,
			focus: null,
			hover: null,
		};
	},
	componentDidMount () {
		document.body.addEventListener('keydown', this.handleMouseDown);
		document.body.addEventListener('keyup', this.handleMouseUp);
		document.body.addEventListener('mousedown', this.handleMouseDown);
		document.body.addEventListener('mouseup', this.handleMouseUp);
		document.body.addEventListener('mouseover', this.handleMouseOver);
		document.body.addEventListener('mouseout', this.handleMouseOut);
	},
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleMouseDown);
		document.body.removeEventListener('keyup', this.handleMouseUp);
		document.body.removeEventListener('mousedown', this.handleMouseDown);
		document.body.removeEventListener('mouseup', this.handleMouseUp);
		document.body.removeEventListener('mouseover', this.handleMouseOver);
		document.body.removeEventListener('mouseout', this.handleMouseOut);
	},
	getStyles () {
		let { checked, readonly } = this.props;
		let { active, focus, hover } = this.state;

		let primaryColor = Color(E.color.appPrimary);

		let background = (checked && !readonly) ? primaryColor.hexString() : 'white';
		let borderColor = (checked && !readonly) ? 'rgba(0,0,0,0.15) rgba(0,0,0,0.2) rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.25) rgba(0,0,0,0.2) rgba(0,0,0,0.15)';
		let boxShadow = (checked && !readonly) ? '0 1px 0 rgba(255,255,255,0.33)' : 'inset 0 1px 0 rgba(0,0,0,0.06)';
		let color = (checked && !readonly) ? 'white' : '#bbb';

		// pseudo state
		if (hover && !focus && !readonly) {
			borderColor = (checked) ? 'rgba(0,0,0,0.25) rgba(0,0,0,0.3) rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.35) rgba(0,0,0,0.3) rgba(0,0,0,0.25)';
		}
		if (active) {
			background = (checked && !readonly) ? primaryColor.darken(0.2).hexString() : '#eee';
			borderColor = (checked && !readonly) ? 'rgba(0,0,0,0.25) rgba(0,0,0,0.3) rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.4) rgba(0,0,0,0.35) rgba(0,0,0,0.3)';
			boxShadow = (checked && !readonly) ? '0 1px 0 rgba(255,255,255,0.33)' : 'inset 0 1px 2px rgba(0,0,0,0.15)';
		}
		if (focus && !active) {
			borderColor = (checked && !readonly) ? 'rgba(0,0,0,0.25) rgba(0,0,0,0.3) rgba(0,0,0,0.35)' : primaryColor.hexString();
			boxShadow = (checked && !readonly) ? `0 0 0 3px ${primaryColor.alpha(0.1).rgbString()}` : `inset 0 1px 2px rgba(0,0,0,0.15), 0 0 0 3px ${primaryColor.alpha(0.1).rgbString()}`;
		}

		// noedit
		if (readonly) {
			background = 'rgba(255,255,255,0.5)';
			borderColor = 'rgba(0,0,0,0.1)';
			boxShadow = 'none';
			color = checked ? primaryColor.hexString() : '#bbb';
		}

		return {
			alignItems: 'center',
			background: background,
			border: '1px solid',
			borderColor: borderColor,
			borderRadius: E.borderRadius.sm,
			boxShadow: boxShadow,
			color: color,
			display: 'inline-flex',
			height: 20,
			justifyContent: 'center',
			MozTransition: 'all 120ms ease-out',
			MsFlexAlign: 'center',
			MsFlexPack: 'center',
			msTransition: 'all 120ms ease-out',
			outline: 'none',
			padding: 0,
			textAlign: 'center',
			transition: 'all 120ms ease-out',
			verticalAlign: 'middle',
			WebkitAlignItems: 'center',
			WebkitJustifyContent: 'center',
			WebkitTransition: 'all 120ms ease-out',
			width: 20,
		};
	},
	handleMouseOver (e) {
		if (!this.props.readonly && e.target === this.refs.checkbox.getDOMNode()) {
			this.handleHover(true);
		}
	},
	handleMouseDown (e) {
		if (!this.props.readonly && e.target === this.refs.checkbox.getDOMNode()) {
			this.handleActive(true);
			this.handleFocus(true);
		}
	},
	handleMouseUp (e) {
		if (!this.props.readonly && e.target === this.refs.checkbox.getDOMNode()) {
			this.handleActive(false);
		} else {
			this.handleActive(false);
			this.handleFocus(false);
		}
	},
	handleMouseOut (e) {
		if (!this.props.readonly && e.target === this.refs.checkbox.getDOMNode()) {
			this.handleHover(false);
		}
	},
	handleActive (pseudo) {
		this.setState({ active: pseudo });
	},
	handleHover (pseudo) {
		this.setState({ hover: pseudo });
	},
	handleFocus (pseudo) {
		this.setState({ focus: pseudo });
	},
	handleChange () {
		this.props.onChange(!this.props.checked);
	},
	render () {
		let { checked, readonly } = this.props;

		let props = blacklist(this.props, 'checked', 'component', 'onChange', 'readonly');
		props.style = this.getStyles();
		props.ref = 'checkbox';
		props.className = classnames('octicon', {
			'octicon-check': checked,
			'octicon-x': (typeof checked === 'boolean') && !checked && readonly,
		});
		props.onClick = readonly ? null : this.handleChange;
		props.onFocus = readonly ? null : this.handleFocus.bind(this, true);
		props.onBlur = readonly ? null : this.handleFocus.bind(this, false);
		props.type = 'button';


		let node = readonly ? 'span' : this.props.component;

		return React.createElement(node, props);
	}
});

module.exports = Checkbox;
