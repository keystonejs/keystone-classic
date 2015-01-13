var React = require('react'),
	Field = require('../Field');

module.exports = Field.create({
	
	renderField: function() {
		return <textarea name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	}
	
});
