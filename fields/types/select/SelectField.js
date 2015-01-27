/**
 * TODO:
 * - Custom path support
 */

var _ = require('underscore'),
	React = require('react'),
	Select = require('react-select'),
	Field = require('../Field'),
	Note = require('../../components/Note');

module.exports = Field.create({
	
	valueChanged: function(newValue) {
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},
	
	renderValue: function() {
		var selected = _.findWhere(this.props.ops, { value: this.props.value });
		return <div className="field-value">{selected ? selected.label : null}</div>;
	},
	
	renderField: function() {
		return <Select name={this.props.path} value={this.props.value} options={this.props.ops} onChange={this.valueChanged} />;	
	}
	
});
