var React = require('react');
var Field = require('../Field');

var FormInput = require('elemental').FormInput;

module.exports = Field.create({
	
	displayName: 'MoneyField',
	
	valueChanged: function(event) {
		var newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
		if (newValue === this.props.value) return;
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},
	
	renderField: function() {
		return <FormInput name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" />;
	}
	
});
