import ColorPicker from 'react-color';
import Field from '../Field';
import React from 'react';
import { FormInput, InputGroup } from 'elemental';

const PICKER_TYPES = ['chrome', 'compact', 'material', 'photoshop', 'sketch', 'slider', 'swatches'];
const TRANSPARENT_BG =
`<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<g fill="#CCCCCC">
		<path d="M0,0 L8,0 L8,8 L0,8 L0,0 Z M8,8 L16,8 L16,16 L8,16 L8,8 Z M0,16 L8,16 L8,24 L0,24 L0,16 Z M16,0 L24,0 L24,8 L16,8 L16,0 Z M16,16 L24,16 L24,24 L16,24 L16,16 Z" />
	</g>
</svg>`;

module.exports = Field.create({
	displayName: 'ColorField',

	propTypes: {
		pickerType: React.PropTypes.oneOf(PICKER_TYPES),
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.string,
	},

	getInitialState () {
		return {
			displayColorPicker: false,
		};
	},

	getDefaultProps () {
		return {
			pickerType: 'sketch'
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

	renderSwatch () {
		return (this.props.value) ? (
			<span className="field-type-color__swatch" style={{ backgroundColor: this.props.value }} />
		) : (
			<span className="field-type-color__swatch" dangerouslySetInnerHTML={{ __html: TRANSPARENT_BG }} />
		);
	},

	renderField () {
		return (
			<div className="field-type-color__wrapper">
				<InputGroup>
					<InputGroup.Section grow>
						<FormInput ref="field" onChange={this.valueChanged} name={this.props.path} value={this.props.value} autoComplete="off" />
					</InputGroup.Section>
					<InputGroup.Section>
						<button type="button" onClick={this.handleClick} className="FormInput FormSelect field-type-color__button">
							{this.renderSwatch()}
						</button>
					</InputGroup.Section>
				</InputGroup>
				<div className="field-type-color__picker">
					<ColorPicker
						color={this.props.value}
						display={this.state.displayColorPicker}
						onChangeComplete={this.handlePickerChange}
						onClose={ this.handleClose }
						position={window.innerWidth > 480 ? 'right' : 'below'}
						type={this.props.pickerType}
						/>
				</div>
			</div>
		);
	}

});
