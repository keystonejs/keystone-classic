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
	
	renderField: function() {
		
		// return <input type="text" name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} />;
		return Select({
			name: this.props.path,
			value: this.props.value,
			options: this.props.ops
		});
		
	}
	
});
