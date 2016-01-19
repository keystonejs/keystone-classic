var React = require('react'),
	Field = require('../Field');

module.exports = Field.create({
	
	displayName: 'NumberField',
	
	valueChanged: function(event) {
		var newValue = event.target.value;
		if (/^-?\d*\.?\d*$/.test(newValue)) {
			this.props.onChange({
				path: this.props.path,
				value: newValue,
			});
		}
	},
	
	renderField: function() {
		return <input type="text" name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	}
	
});
