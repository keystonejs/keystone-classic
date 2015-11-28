import React from 'react';
import blacklist from 'blacklist';
import vkey from 'vkey';

var AltText = React.createClass({
	propTypes: {
		component: React.PropTypes.string,
		modified: React.PropTypes.string,
		modifier: React.PropTypes.string,
		normal: React.PropTypes.string,
	},
	getDefaultProps () {
		return {
			component: 'span',
			modifier: '<alt>',
			normal: '',
			modified: ''
		};
	},
	getInitialState () {
		return {
			modified: false
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
			modified: true
		});
	},
	handleKeyUp (e) {
		if (vkey[e.keyCode] !== this.props.modifier) return;
		this.setState({
			modified: false
		});
	},
	render () {
		var props = blacklist(this.props, 'component', 'modifier', 'normal', 'modified');
		return React.createElement(this.props.component, props, this.state.modified ? this.props.modified : this.props.normal);
	}
});

module.exports = AltText;
