var React = require('react'),
	Field = require('../field'),
	$     = require('jquery');

require('./lib/bootstrap-colorpicker');

module.exports = Field.create({
	renderField: function() {
		return [
			<input ref='field' type='text' className='form-control' onChange={this.valueChanged} name={this.props.path} value={this.props.value} autoComplete='off' />,
			<div className='color-preview' style={ { color: this.props.value } } />
		];
	}
});
