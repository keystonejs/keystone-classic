var React = require('react');
var blacklist = require('blacklist');
var vkey = require('vkey');

var AltText = React.createClass({

	displayName: 'AltText',

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

	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	},

	render () {
		var props = blacklist(this.props, 'component', 'modifier', 'normal', 'modified');

		return React.createElement(this.props.component, props, this.state.modified ? this.props.modified : this.props.normal);
	}

});

module.exports = AltText;
