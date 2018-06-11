import Field from '../Field';
import React from 'react';
import theme from '../../../admin/client/theme';
import { FormInput } from '../../../admin/client/App/elemental';

module.exports = Field.create({
	displayName: 'TextareaField',
	statics: {
		type: 'Textarea',
	},
	renderCount () {
		const { min, max, value } = this.props;
		
		const length = value ? value.length : 0;
		const lessThanMin = min ? length < min : false;
		const greaterThanMax = max ? length > max : false;

		const color = (lessThanMin || greaterThanMax) ? theme.color.danger : theme.color.default;
		const styles = { color, paddingTop: '5px', textAlign: 'right' };

		return <h5 style={styles}>{`Characters: ${length}`}</h5>;
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
		const { displayChars, height, path, style, value } = this.props;

		const styles = {
			height: height,
			...style,
		};
		return (
			<div>
				<FormInput
					autoComplete="off"
					multiline
					name={this.getInputName(path)}
					onChange={this.valueChanged}
					ref="focusTarget"
					style={styles}
					value={value}
				/>
				{displayChars
				&& this.renderCount()}
			</div>
		);
	},
});
