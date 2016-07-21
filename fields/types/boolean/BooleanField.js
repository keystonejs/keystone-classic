import React from 'react';
import Field from '../Field';
import Checkbox from '../../components/Checkbox';
import { FormField, FormNote } from 'elemental';

module.exports = Field.create({
	displayName: 'BooleanField',
	statics: {
		type: 'Boolean',
	},
	propTypes: {
		indent: React.PropTypes.bool,
		label: React.PropTypes.string,
		note: React.PropTypes.string,
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.bool,
	},

	valueChanged (value) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	renderNote () {
		if (!this.props.note) return;

		return <FormNote note={this.props.note} />;
	},
	renderFormInput () {
		if (!this.shouldRenderField()) return;

		return (
			<input
				name={this.props.path}
				type="hidden"
				value={!!this.props.value}
			/>
		);
	},
	renderCheckbox () {
		return !this.shouldRenderField() ? (
			<Checkbox
				checked={this.props.value}
				readonly
			/>
		) : (
			<Checkbox
				checked={this.props.value}
				onChange={this.valueChanged}
			/>
		);
	},
	renderUI () {
		return (
			<FormField offsetAbsentLabel={this.props.indent}>
				<label style={{ height: '2.3em' }}>
					{this.renderFormInput()}
					{this.renderCheckbox()}
					<span style={{ marginLeft: '.75em' }}>
						{this.props.label}
					</span>
				</label>
				{this.renderNote()}
			</FormField>
		);
	},
});
