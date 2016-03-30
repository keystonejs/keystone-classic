import React from 'react';
import ReactDOM from 'react-dom';

import { FormField, FormInput, FormRow, SegmentedControl } from 'elemental';

const DISTANCE_OPTIONS = [
	{ label: 'Max distance (km)', value: 'max' },
	{ label: 'Min distance (km)', value: 'min' },
];

function getDefaultValue () {
	return {
		lat: undefined,
		lon: undefined,
		distance: {
			mode: DISTANCE_OPTIONS[0].value,
			value: undefined,
		},
	};
}

var TextFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			lat: React.PropTypes.number,
			lon: React.PropTypes.number,
			distance: React.PropTypes.shape({
				mode: React.PropTypes.string,
				value: React.PropTypes.number,
			}),
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	changeLat (evt) {
		this.updateFilter({ lat: evt.target.value });
	},
	changeLon (evt) {
		this.updateFilter({ lon: evt.target.value });
	},
	changeDistanceValue (evt) {
		this.updateFilter({
			distance: {
				mode: this.props.filter.distance.mode,
				value: evt.target.value,
			},
		});
	},
	changeDistanceMode (mode) {
		this.updateFilter({
			distance: {
				mode,
				value: this.props.filter.distance.value,
			},
		});
	},
	render () {
		const { filter } = this.props;
		const distanceModeVerb = filter.distance.mode === 'max' ? 'Maximum' : 'Minimum';

		return (
			<div>
				<FormRow>
					<FormField
						width="one-half"
						label="Latitude"
					>
						<FormInput
							autofocus
							ref="latitude"
							type="number"
							required="true"
							step={0.01}
							value={filter.lat}
							onChange={this.changeLat}
							placeholder={'Latitude'}
						/>
					</FormField>
					<FormField
						width="one-half"
						label="Longitude"
					>
						<FormInput
							ref="longitude"
							type="number"
							required="true"
							step={0.01}
							value={filter.lon}
							onChange={this.changeLon}
							placeholder={'Longitude'}
						/>
					</FormField>
				</FormRow>
				<FormField>
					<SegmentedControl
						equalWidthSegments
						options={DISTANCE_OPTIONS}
						value={this.props.filter.distance.mode}
						onChange={this.changeDistanceMode}
					/>
				</FormField>
				<FormField>
					<FormInput
						ref="distance"
						type="number"
						value={filter.distance.value}
						onChange={this.changeDistanceValue}
						placeholder={distanceModeVerb + ' distance from point'}
					/>
				</FormField>
			</div>
		);
	},
});

module.exports = TextFilter;
