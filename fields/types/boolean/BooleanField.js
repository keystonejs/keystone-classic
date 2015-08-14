var React = require('react');
var Field = require('../Field');

var { Checkbox, FormField } = require('elemental');

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
				<Checkbox label={this.props.label} name={this.props.path} checked={this.props.value} onChange={this.valueChanged} />
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
