import React from 'react';

module.exports = React.createClass({
	displayName: 'InvalidFieldType',
	propTypes: {
		path: React.PropTypes.string,
		type: React.PropTypes.string,
	},
	render () {
		return <div className="alert alert-danger">Invalid field type <strong>{this.props.type}</strong> at path <strong>{this.props.path}</strong></div>;
	},
});
