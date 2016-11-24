import Field from '../Field';
import React from 'react';
import { FormInput } from '../../../admin/client/App/elemental';

module.exports = Field.create({
	displayName: 'TextareaField',
	statics: {
		type: 'Textarea',
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
