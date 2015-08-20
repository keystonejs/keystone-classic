import ColorPicker from 'react-color';
import Field from '../Field';
import React from 'react';
import { FormInput, InputGroup } from 'elemental';

module.exports = Field.create({
	displayName: 'ColorField',
	
	getInitialState () {
		return {
			displayColorPicker: false,
		};
	},
	
	updateValue (value) {
		this.props.onChange({
			path: this.props.path,
			value: value
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

	handleClick() {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	},

	handleClose() {
		this.setState({ displayColorPicker: false });
	},

	handlePickerChange (color) {
		var newValue = '#' + color.hex;
		
		if (newValue === this.props.value) return;
		
		this.updateValue(newValue);
	},
	
	renderField () {
		
		return (
			<div className="field-type-color__wrapper">
				<InputGroup>
					<InputGroup.Section>
						<FormInput ref="field" onChange={this.valueChanged} name={this.props.path} value={this.props.value} autoComplete="off" />
					</InputGroup.Section>
					<InputGroup.Section>
						<button type="button" onClick={this.handleClick} className="FormInput FormSelect field-type-color__button">
							<span className="field-type-color__swatch" style={{ backgroundColor: this.props.value }} />
						</button>
					</InputGroup.Section>
				</InputGroup>
				<ColorPicker
					className="field-type-color__picker"
					color={this.props.value}
					display={this.state.displayColorPicker}
					onChangeComplete={this.handlePickerChange}
					onClose={ this.handleClose }
					position={window.innerWidth > 480 ? 'right' : 'below'}
					type="sketch"
					/>
			</div>
		);
	}
	
});
