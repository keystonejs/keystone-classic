var React = require('react');
var Field = require('../Field');

var FormField = require('elemental').FormField;

module.exports = Field.create({

	displayName: 'BooleanField',

	valueChanged: function(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.checked
		});
	},

	renderUI: function() {

		var input;

		if (this.shouldRenderField()) {
			input = (
				<label htmlFor={this.props.path} className="checkbox">
					<input type='checkbox' name={this.props.path} id={this.props.path} value='true' checked={this.props.value} onChange={this.valueChanged} />
					{this.props.label}
				</label>
			);
		} else {
			var state = this.props.value ? 'checked' : 'unchecked';
			var imgSrc = '/keystone/images/icons/16/checkbox-' + state + '.png';
			input = (
				<div>
					<img src={imgSrc} width='16' height='16' className={state} style={{ marginRight: 5 }} />
					<span>{this.props.label}</span>
				</div>
			);
		}

		return <FormField offsetAbsentLabel={this.props.indent} className="field-type-boolean">{input}</FormField>;
	}

});
