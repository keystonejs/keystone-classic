var React = require('react');

module.exports = React.createClass({
	
	render: function() {
		return this.props.note ? 
			<div className="field-note" dangerouslySetInnerHTML={{ __html: this.props.note }} /> :
			null;
	}
	
});
