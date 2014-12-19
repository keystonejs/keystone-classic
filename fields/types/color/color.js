var React = require('react'),
	Field = require('../field'),
	$     = require('jquery');

require('./lib/bootstrap-colorpicker');

module.exports = Field.create({
	componentDidMount: function() {
		if (!this.refs.field) return;

	},

	renderField: function() {
		return [
			<input ref='field' type='text' className='form-control' onChange={this.valueChanged} name={this.props.path} value={this.props.value} autoComplete='off' />,
			<div className='color-preview' style={ { color: this.props.value } } />
		];
	}
});
