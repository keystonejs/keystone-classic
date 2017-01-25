import Field from '../Field';
import React from 'react';
import { FormInput } from '../../../admin/client/App/elemental';

module.exports = Field.create({
	displayName: 'TextareaField',
	statics: {
		type: 'Textarea',
	},
	renderValue () {
		const { height } = this.props;

		const styles = {
			height: height,
			whiteSpace: 'pre-wrap',
			overflowY: 'auto',
		};
		return (
			<FormInput multiline noedit style={styles}>{this.props.value}</FormInput>
		);
	},
	renderField () {
		const { height, path, style, value } = this.props;

		const styles = {
			height: height,
			...style,
		};
		return (
			<FormInput
				autoComplete="off"
				multiline
				name={this.getInputName(path)}
				onChange={this.valueChanged}
				ref="focusTarget"
				style={styles}
				value={value}
			/>
		);
	},
});
