var React = require('react');
var Field = require('../Field');

var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;
var FormRow = require('elemental').FormRow;

module.exports = Field.create({
	
	displayName: 'NameField',

	focusTargetRef: 'first',
	
	valueChanged: function(which, event) {
		this.props.value[which] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: this.props.value
		});
	},
	
	renderValue: function() {
		var values = {};
		if (this.props.value.first) {
			values.first = <div className="field-value">{this.props.value.first}</div>;
		}
		if (this.props.value.last) {
			values.last = <div className="field-value">{this.props.value.last}</div>;
		}
		if (!values.first && values.last) {
			values.none = <div className="field-value" />;
		}
		return values;
	},
	
	renderField: function() {
		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput name={this.props.paths.first} placeholder="First name" ref="first" value={this.props.value.first} onChange={this.valueChanged.bind(this, 'first')} autoComplete="off" />
				</FormField>
				<FormField width="one-half">
					<FormInput name={this.props.paths.last} placeholder="Last name" ref="last" value={this.props.value.last} onChange={this.valueChanged.bind(this, 'last')} autoComplete="off" />
				</FormField>
			</FormRow>
		);
	}
	
});
