import Field from '../Field';
import React from 'react';
import { FormInput } from '../../../admin/client/App/elemental';


// See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html

module.exports = Field.create({
	displayName: 'JsonField',
	statics: {
		type: 'Json',
	},
	onJsonChanged (event) {
		let jsonObj = JSON.parse(event.target.value);
		this.props.valueChanged(jsonObj);
	},
	getJsonValue () {
		if (this.props.value != null) {
			return JSON.stringify(this.props.value, null, '\t');
		}
		return this.props.value;
	},
	renderValue () {
		const { height } = this.props;

		const styles = {
			height: height,
			whiteSpace: 'pre-wrap',
			overflowY: 'auto',
		};

		return (
			<FormInput multiline noedit style={styles}>{this.getJsonValue()}</FormInput>
		);
	},
	renderField () {
		const { height, path, style } = this.props;

		const styles = {
			height: height,
			...style,
		};

		return (
			<FormInput
				autoComplete="off"
				multiline
				name={this.getInputName(path)}
				onChange={this.onJsonChanged}
				ref="focusTarget"
				style={styles}
				value={this.getJsonValue()}
			/>
		);
	},

});
