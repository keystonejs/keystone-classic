var React = require('react'),
	Field = require('../Field');

module.exports = Field.create({

	displayName: 'BooleanField',

	valueChanged: function(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.checked
		});
	},

	renderUI: function() {

		if (this.props.hidden) {
			return <input type='hidden' name={this.props.path} value={this.props.value} />;
		}

		var input, fieldClassName = 'field-ui';

		if (this.props.indent) {
			fieldClassName += ' field-indented';
		}

		if (this.shouldRenderField()) {
			input = (
				<div className={fieldClassName}>
					<label htmlFor={this.props.path} className="checkbox">
						<input type='checkbox' name={this.props.path} id={this.props.path} value='true' checked={this.props.value} onChange={this.valueChanged} />
						{this.props.label}
					</label>
					{this.renderNote()}
				</div>
			);
		} else {
			var state = this.props.value ? 'checked' : 'unchecked';
			var imgSrc = '/keystone/images/icons/16/checkbox-' + state + '.png';
			input = (
				<div className={fieldClassName}>
					<img src={imgSrc} width='16' height='16' className={state} style={{ marginRight: 5 }} />
					<span>{this.props.label}</span>
					<div>{this.renderNote()}</div>
				</div>
			);
		}

		return <div className="field field-type-boolean">{input}</div>;
	}

});
