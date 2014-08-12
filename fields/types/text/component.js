/** @jsx React.DOM */

var React = require('react'),
	Note = require('../../components/note');

module.exports = React.createClass({
	
	/*
		TODO (common)
		- dependsOn
		- collapse
	 */
	
	valueChanged: function(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.value
		});
	},
	
	render: function() {
		
		var fieldClassName = 'field-ui width-' + this.props.width;
		
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
