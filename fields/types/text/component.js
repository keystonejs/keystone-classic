/** @jsx React.DOM */

var React = require('react'),
	FieldMixin = require('../../mixins/field'),
	TextFieldMixin = require('../../mixins/textField'),
	Note = require('../../components/note');

module.exports = React.createClass({
	
	mixins: [FieldMixin, TextFieldMixin],
	
	/*
		TODO:
		(common)
		- collapse
	 */
	
	render: function() {
		
		var fieldClassName = 'field-ui width-' + this.props.width;
		
		if (!this.validateDependsOn()) {
			return null;
		}
		
		var input = this.props.noedit ?
			<div className="field-value">{this.props.value}</div> :
			<input type="text" name={this.props.path} value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
		
		return (
			<div className="field type-text">
				<label className="field-label">{this.props.label}</label>
				<div className={fieldClassName}>
					{input}
					<Note note={this.props.note} />
				</div>
			</div>
		);
	}
	
});
