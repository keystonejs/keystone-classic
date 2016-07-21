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
	focusTargetRef: 'first',
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		paths: PropTypes.shape(NAME_SHAPE).isRequired,
		value: PropTypes.shape(NAME_SHAPE).isRequired,
	},

	valueChanged: function (which, event) {
		this.props.value[which] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: this.props.value,
		});
	},
	renderValue () {
		const inputStyle = { width: '100%' };

		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput noedit style={inputStyle}>
						{this.props.value.first}
					</FormInput>
				</FormField>
				<FormField width="one-half">
					<FormInput noedit style={inputStyle}>
						{this.props.value.last}
					</FormInput>
				</FormField>
			</FormRow>
		);
	},
	renderField () {
		return (
			<FormRow>
				<FormField width="one-half">
					<FormInput
						autoComplete="off"
						name={this.props.paths.first}
						onChange={this.valueChanged.bind(this, 'first')}
						placeholder="First name"
						ref="first"
						value={this.props.value.first}
					/>
				</FormField>
				<FormField width="one-half">
					<FormInput
						autoComplete="off"
						name={this.props.paths.last}
						onChange={this.valueChanged.bind(this, 'last')}
						placeholder="Last name"
						ref="last"
						value={this.props.value.last}
					/>
				</FormField>
			</FormRow>
		);
	},
});
