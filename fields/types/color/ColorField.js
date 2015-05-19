var React = require('react');
var Field = require('../Field');

var FormIconField = require('elemental').FormIconField;
var FormInput = require('elemental').FormInput;

module.exports = Field.create({
	
	displayName: 'ColorField',
	
	valueChanged: function(event) {
		var newValue = event.target.value;
		if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
			newValue = '#' + newValue;
		}
		if (newValue === this.props.value) return;
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},
	
	renderField: function() {
		
		var colorPreview = null;
		
		if (this.props.value) {
			colorPreview = (
				<div className="field-type-color__preview">
					<div className="field-type-color__preview__inner" style={{ background: this.props.value }} />
				</div>
			);
		}
		
		return (
			<span>
				<FormInput ref="field" onChange={this.valueChanged} name={this.props.path} value={this.props.value} autoComplete="off" />
				{colorPreview}
			</span>
		);
	}
	
});
