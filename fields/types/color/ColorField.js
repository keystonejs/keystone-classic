import { SketchPicker } from 'react-color';
import Field from '../Field';
import React from 'react';
import { FormInput, InputGroup } from 'elemental';
import swatch from './transparent-swatch';

module.exports = Field.create({
	displayName: 'ColorField',
	statics: {
		type: 'Color',
	},
	propTypes: {
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.string,
	},

	getInitialState () {
		return {
			displayColorPicker: false,
		};
	},
	updateValue (value) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	handleInputChange (event) {
		var newValue = event.target.value;
		if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
			newValue = '#' + newValue;
		}
		if (newValue === this.props.value) return;

		this.updateValue(newValue);
	},
	handleClick () {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	},
	handleClose () {
		this.setState({ displayColorPicker: false });
	},
	handlePickerChange (color) {
		var newValue = color.hex;

		if (newValue === this.props.value) return;

		this.updateValue(newValue);
	},
	renderSwatch () {
		const className = 'field-type-color__swatch';

		return (this.props.value) ? (
			<span
				className={className}
				style={{ backgroundColor: this.props.value }}
			/>
		) : (
			<span
				className={className}
				dangerouslySetInnerHTML={{ __html: swatch }}
			/>
		);
	},
	renderField () {
		const { displayColorPicker } = this.state;
		const buttonClassName = 'FormInput FormSelect field-type-color__button';

		return (
			<div className="field-type-color__wrapper">
				<InputGroup>
					<InputGroup.Section grow>
						<FormInput
							autoComplete="off"
							name={this.props.path}
							onChange={this.valueChanged}
							ref="field"
							value={this.props.value}
						/>
					</InputGroup.Section>
					<InputGroup.Section>
						<button type="button" onClick={this.handleClick} className={buttonClassName}>
							{this.renderSwatch()}
						</button>
					</InputGroup.Section>
				</InputGroup>
				{displayColorPicker && (
					<div>
						<div
							className="field-type-color__popover__cover"
							onClick={this.handleClose}
						/>
						<div className="field-type-color__popover" onClick={e => e.stopPropagation()}>
							<SketchPicker
								color={this.props.value}
								onChangeComplete={this.handlePickerChange}
								onClose={this.handleClose}
							/>
						</div>
					</div>
				)}
			</div>
		);
	},
});
