var React = require('react'),
	Field = require('../field'),
	Note  = require('../../components/note'),
	$     = require('jquery');

require('./lib/bootstrap-colorpicker');

module.exports = Field.create({
	
	componentDidMount: function() {
		$(this.refs.field.getDOMNode()).colorpicker();
	},

	renderUI: function() {
		var value = this.props.value;

		var field;
		if (this.props.noedit) {
			field = <div className='field-value'>{value}</div>;
		} else {
			field = <div className='input-group field-type-color'>
				<input ref='field' type='text' className='form-control' name={this.props.path} value={value} autocomplete='off' />
				<span className='input-group-addon' />
			</div>;
		}

		return <div className='field field-type-color'>
			<label className='field-label'>{this.props.label}</label>
			<div className='field-ui'>{field}</div>
			<Note note={this.props.note} />
		</div>;
	}
	
});
