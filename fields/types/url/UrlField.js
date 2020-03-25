import React from 'react';
import Field from '../Field';
import { FormInput } from '../../../admin/client/App/elemental';

module.exports = Field.create({
	displayName: 'URLField',
	statics: {
		type: 'Url',
	},
	openValue () {
		var href = this.props.value;
		if (!href) return;
		if (!/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + href;
		}
		window.open(href);
	},
	renderField () {
		const { value } = this.props;
		return (
			<div>
				<FormInput
					autoComplete="off"
					name={this.getInputName(this.props.path)}
					onChange={this.valueChanged}
					ref="focusTarget"
					type="url"
					value={value}
				/>
				{ this.renderThumb() }
			</div>
		);
	},
	renderValue () {
		const { value } = this.props;
		return (
			<div>
				<FormInput noedit onClick={value && this.openValue}>
					{value}
				</FormInput>
				{ this.renderThumb() }
			</div>
		);
	},
	renderThumb () {
		const { thumb, value } = this.props;
		if (thumb === true) {
			return (
				<img src={value}/>
			);
		}
		return ('');
	},
});
