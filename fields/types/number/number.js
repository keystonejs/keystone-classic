var React = require('react'),
	Field = require('../field'),

module.exports = Field.create({
	
	supports: {
		width: true
	},
	
	renderField: function() {
		return <text name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	}
	
});
