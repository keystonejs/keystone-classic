/** @jsx React.DOM */

var React = require('react'),
	FieldMixin = require('../../mixins/field'),
	Note = require('../../components/note');

module.exports = React.createClass({
	
	mixins: [FieldMixin],
	
	valueChanged: function(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.checked
		});
	},
	
	render: function() {
		
		var fieldClassName = 'field-ui';
		
		if (this.props.indent) {
			fieldClassName += ' field-indented';
		}
		
		console.log(this.props);
		
		var input;
		
		if (this.props.noedit) {
			var state = this.props.value ? 'checked' : 'unchecked';
			input = (
				<div className={fieldClassName}>
					<img src='/keystone/images/icons/16/checkbox-checked.png' width='16' height='16' className={state} />
					<span>{this.props.label}</span>
				</div>
			);
		} else {
			input = (
				<div className={fieldClassName}>
					<label htmlFor={this.props.path} className="checkbox">
						<input type='checkbox' name={this.props.path} id={this.props.path} value='true' checked={this.props.value} onChange={this.valueChanged} />
						{this.props.label}
					</label>
				</div>
			);
		}
		
		return <div className="field type-boolean">{input}</div>;
	}
	
});
