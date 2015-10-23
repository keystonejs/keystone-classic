var React = require('react');
var blacklist = require('blacklist');
var classNames = require('classnames');

module.exports = React.createClass({
	displayName: 'ToolbarSection',
	propTypes: {
		className: React.PropTypes.string,
		left: React.PropTypes.bool,
		right: React.PropTypes.bool
	},

	render () {
		// classes
		var className = classNames('Toolbar__section', {
			'Toolbar__section--left': this.props.left,
			'Toolbar__section--right': this.props.right
		}, this.props.className);

		// props
		var props = blacklist(this.props, 'left', 'right', 'className');

		return <div {...props} className={className}>{this.props.children}</div>;
	}

});
