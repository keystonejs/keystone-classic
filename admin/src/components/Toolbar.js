var React = require('react');
var blacklist = require('blacklist');
var classNames = require('classnames');

module.exports = React.createClass({
	displayName: 'Toolbar',
	propTypes: {
		className: React.PropTypes.string
	},

	render () {
		return (
			<div {...this.props} className="Toolbar">
				<div className="container">
					{this.props.children}
				</div>
			</div>
		);
	}

});

// expose the children to the top level export
module.exports.Section = require('./ToolbarSection');
