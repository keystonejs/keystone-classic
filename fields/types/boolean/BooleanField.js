import React from 'react';
import Field from '../Field';
import { Checkbox, FormField, FormNote } from 'elemental';

module.exports = Field.create({

	displayName: 'BooleanField',

	propTypes: {
		indent: React.PropTypes.bool,
		label: React.PropTypes.string,
		note: React.PropTypes.string,
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.bool,
	},

	valueChanged (event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.checked
		});
	},

	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	renderUI () {
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
		return (
			<FormField offsetAbsentLabel={this.props.indent} className="field-type-boolean">
				{input}
				{this.renderNote()}
			</FormField>
		);
	}

});
