/**
 * TODO:
 * - Custom path support
 */

var _ = require('underscore'),
	React = require('react'),
	Select = require('react-select'),
	Field = require('../field'),
	Note = require('../../components/note');

module.exports = Field.create({
	
	valueChanged: function(newValue) {
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},
	
	renderField: function() {
		return <Select name={this.props.path} value={this.props.value} options={this.props.ops} onChange={this.valueChanged} />;	
	}
	
});
