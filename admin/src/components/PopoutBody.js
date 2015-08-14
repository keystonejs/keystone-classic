var React = require('react');

var PopoutBody = React.createClass({
	displayName: 'PopoutBody',
	propTypes: {
		children: React.PropTypes.node.isRequired
	},
	
	render () {
		return <div className="Popout__body Popout__scrollable-area" {...this.props} />;
	}
	
});

module.exports = PopoutBody;
