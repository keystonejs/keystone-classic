var React = require('react');
var blacklist = require('blacklist');
var classNames = require('classnames');
var { Container } = require('elemental');

module.exports = React.createClass({
	displayName: 'Toolbar',
	propTypes: {
		className: React.PropTypes.string
	},

	render () {
		return (
			<div {...this.props} className="Toolbar">
				<Container clearfix >
					{this.props.children}
				</Container>
			</div>
		);
	}

});

// expose the children to the top level export
module.exports.Section = require('./ToolbarSection');
