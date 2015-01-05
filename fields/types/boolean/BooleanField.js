var React = require('react'),
	Field = require('../field');

module.exports = Field.create({
	
	valueChanged: function(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.checked
		});
	},
	
	renderUI: function() {
		
		var input, state, fieldClassName = 'field-ui';
		
		if (this.props.indent) {
			fieldClassName += ' field-indented';
		}
		
		if (this.props.noedit) {
			state = this.props.value ? 'checked' : 'unchecked';
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
		
		return <div className="field field-type-boolean">{input}</div>;
	}
	
});
