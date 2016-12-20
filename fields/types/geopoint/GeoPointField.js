import Field from '../Field';
import React from 'react';
import {
	FormInput,
	Grid,
} from '../../../admin/client/App/elemental';

module.exports = Field.create({

	displayName: 'GeopointField',
	statics: {
		type: 'Geopoint',
	},

	focusTargetRef: 'lat',

	handleLat (event) {
		const { value = [], path, onChange } = this.props;
		const newVal = event.target.value;
		onChange({
			path,
			value: [value[0], newVal],
		});
	},

	handleLong (event) {
		const { value = [], path, onChange } = this.props;
		const newVal = event.target.value;
		onChange({
			path,
			value: [newVal, value[1]],
		});
	},

	renderValue () {
		const { value } = this.props;
		if (value && value[1] && value[0]) {
			return <FormInput noedit>{value[1]}, {value[0]}</FormInput>; // eslint-disable-line comma-spacing
		}
		return <FormInput noedit>(not set)</FormInput>;
	},

	renderField () {
		const { value = [], path } = this.props;
		return (
			<Grid.Row xsmall="one-half" gutter={10}>
				<Grid.Col>
					<FormInput
						autoComplete="off"
						name={this.getInputName(path + '[1]')}
						onChange={this.handleLat}
						placeholder="Latitude"
						ref="lat"
						value={value[1]}
					/>
				</Grid.Col>
				<Grid.Col width="one-half">
					<FormInput
						autoComplete="off"
						name={this.getInputName(path + '[0]')}
						onChange={this.handleLong}
						placeholder="Longitude"
						ref="lng"
						value={value[0]}
					/>
				</Grid.Col>
			</Grid.Row>
		);
	},

});
