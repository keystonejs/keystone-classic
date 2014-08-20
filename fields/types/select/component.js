/** @jsx React.DOM */

/**
 * TODO:
 * - Custom path support
 */

var _ = require('underscore'),
	React = require('react'),
	Field = require('../field'),
	Select = require('../../components/select'),
	Note = require('../../components/note');

module.exports = Field.create({
	
	renderField: function() {
		
		// return <input type="text" name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} />;
		return Select({
			value: this.props.value,
			options: this.props.ops
		});
		
	}
	
});
