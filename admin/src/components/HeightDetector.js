var React = require('react');
var blacklist = require('blacklist');

var HeightDetector = React.createClass({
	componentDidMount () {
		this.props.onLayout && this.props.onLayout(this.getDOMNode().offsetHeight);
	},
	render () {
		var props = blacklist(this.props, 'onLayout');
		return <div {...props} />
	}
});

module.exports = HeightDetector;
