import React from 'react';
import blacklist from 'blacklist';
import vkey from 'vkey';

var AltText = React.createClass({
	propTypes: {
		component: React.PropTypes.string,
		modifiedLabel: React.PropTypes.string,
		modifiedValue: React.PropTypes.object,
		modifier: React.PropTypes.string,
		normalLabel: React.PropTypes.string,
		normalValue: React.PropTypes.object,
	},
	getDefaultProps () {
		return {
			component: 'span',
			modifier: '<alt>',
			normal: '',
			modified: '',
		};
	},
	getInitialState () {
		return {
			modified: false,
		};
	},
	componentDidMount () {
		document.body.addEventListener('keydown', this.handleKeyDown, false);
		document.body.addEventListener('keyup', this.handleKeyUp, false);
	},
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	},
	handleKeyDown (e) {
		if (vkey[e.keyCode] !== this.props.modifier) return;
		this.setState({
			modified: true,
		});
	},
	handleKeyUp (e) {
		if (vkey[e.keyCode] !== this.props.modifier) return;
		this.setState({
			modified: false,
		});
	},
	render () {
		var props = blacklist(this.props, 'component', 'modifier', 'normal', 'modified');
		var modifiedOrNormal = this.state.modified 
										? this.props.modifiedLabel || this.props.modifiedValue
										: this.props.normalLabel || this.props.normalValue;
		return React.createElement(this.props.component, props, modifiedOrNormal);
	},
});

module.exports = AltText;
