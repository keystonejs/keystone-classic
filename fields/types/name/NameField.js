import Field from '../Field';
import React, { PropTypes } from 'react';
import { FormField, FormInput, FormRow } from 'elemental';

const NAME_SHAPE = {
	first: PropTypes.string,
	last: PropTypes.string,
};

module.exports = Field.create({
	displayName: 'NameField',
	statics: {
		type: 'Name',
	},
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		paths: PropTypes.shape(NAME_SHAPE).isRequired,
		value: PropTypes.shape(NAME_SHAPE).isRequired,
	},

	valueChanged: function (which, event) {
		const { value = {}, path, onChange } = this.props;
		onChange({
			path,
			value: {
				...value,
				[which]: event.target.value,
			},
		});
	},
	changeFirst: function (event) {
		return this.valueChanged('first', event);
	},
	changeLast: function (event) {
		return this.valueChanged('last', event);
	},
	renderValue () {
		const inputStyle = { width: '100%' };
		const { value = {} } = this.props;

		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput noedit style={inputStyle}>
						{value.first}
					</FormInput>
				</FormField>
				<FormField width="one-half">
					<FormInput noedit style={inputStyle}>
						{value.last}
					</FormInput>
				</FormField>
			</FormRow>
		);
	},
	renderField () {
		const { value = {}, paths } = this.props;
		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput
						autoFocus
						autoComplete="off"
						name={paths.first}
						onChange={this.changeFirst}
						placeholder="First name"
						value={value.first}
					/>
				</FormField>
				<FormField width="one-half">
					<FormInput
						autoComplete="off"
						name={paths.last}
						onChange={this.changeLast}
						placeholder="Last name"
						value={value.last}
					/>
				</FormField>
			</FormRow>
		);
	},
});
