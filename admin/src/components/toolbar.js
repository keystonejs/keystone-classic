var React = require('react');

/**
 * TODO
 * - Stick at the bottom of the viewport
 */

var Toolbar = React.createClass({
	render: function() {
		return (
			<div className="toolbar">{this.props.children}</div>
		);
	}
});

module.exports = Toolbar;
