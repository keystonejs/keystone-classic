/**
 * TODO:
 * - Custom path support
 */

var React = require('react');
var Field = require('../Field');
var _ = require('underscore');
var Select = require('react-select');

var FormInput = require('elemental').FormInput;

module.exports = Field.create({
	
	displayName: 'SelectField',
	
	valueChanged: function(newValue) {
		// TODO: This should be natively handled by the Select component
		if (this.props.numeric && 'string' === typeof newValue) {
			newValue = newValue ? Number(newValue) : undefined;
		}
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},
	
	renderValue: function() {
		var selected = _.findWhere(this.props.ops, { value: this.props.value });
		return <FormInput noedit>{selected ? selected.label : null}</FormInput>;
	},
	
	renderField: function() {
		// TODO: This should be natively handled by the Select component
		var ops = (this.props.numeric) ? this.props.ops.map(function(i) { return { label: i.label, value: String(i.value) }; }) : this.props.ops;
		var value = ('number' === typeof this.props.value) ? String(this.props.value) : this.props.value;
		return <Select name={this.props.path} value={value} options={ops} onChange={this.valueChanged} />;	
	}
	
});
