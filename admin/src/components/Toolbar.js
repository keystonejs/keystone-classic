var React = require('react');
var blacklist = require('blacklist');
var classNames = require('classnames');

module.exports = React.createClass({
	displayName: 'Toolbar',
	propTypes: {
		className: React.PropTypes.string
	},
	
	render: function() {
		// classes
		var componentClass = 'Toolbar';

		// props
		var props = blacklist(this.props, 'className');
		props.className = componentClass;

		return (
			<div {...props}>
				<div className="container">
					{this.props.children}
				</div>
			</div>
		);
	}
	
});


module.exports.Section = React.createClass({
	displayName: 'Toolbar__section',
	propTypes: {
		left: React.PropTypes.bool,
		right: React.PropTypes.bool,
		className: React.PropTypes.string
	},
	
	render: function() {
		// classes
		var componentClass = classNames('Toolbar__section', {
			'Toolbar__section--left': this.props.left,
			'Toolbar__section--right': this.props.right
		}, this.props.className);

		// props
		var props = blacklist(this.props, 'left', 'right', 'className');
		props.className = componentClass;

		return <div {...props}>{this.props.children}</div>;
	}
	
});
