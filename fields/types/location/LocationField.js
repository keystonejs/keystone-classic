import _ from 'lodash';
import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import Field from '../Field';
import CollapsedFieldLabel from '../../components/CollapsedFieldLabel';
import NestedFormField from '../../components/NestedFormField';

import {
	FormField,
	FormInput,
	FormNote,
	Grid,
	LabelledControl,
} from '../../../admin/client/App/elemental';

const AsyncGoogleMap = _.flowRight(
  withScriptjs,
  withGoogleMap,
)(props => (
	<GoogleMap
		ref={props.onMapLoad}
		defaultZoom={16}
		defaultCenter={props.defaultCenter}
		onClick={props.onMapClick}
		>
		{props.marker && (
			<Marker
				{...props.marker}
				onRightClick={() => props.onMarkerRightClick(props.marker)}
				/>
		)}
	</GoogleMap>
));

/**
 * TODO:
 * - Remove dependency on underscore
 * - Custom path support
 */

module.exports = Field.create({

	displayName: 'LocationField',
	statics: {
		type: 'Location',
	},

	getInitialState () {
		return {
			collapsedFields: {},
			improve: false,
			overwrite: false,
		};
	},

	componentWillMount () {
		const { value = [] } = this.props;
		var collapsedFields = {};
		_.forEach(['number', 'name', 'street2', 'geo'], (i) => {
			if (!value[i]) {
				collapsedFields[i] = true;
			}
		}, this);
		this.setState({ collapsedFields });
	},

	shouldCollapse () {
		return this.props.collapse && !this.formatValue();
	},

	uncollapseFields () {
		this.setState({
			collapsedFields: {},
		});
	},

	fieldChanged (fieldPath, event) {
		const { value = {}, path, onChange } = this.props;
		onChange({
			path,
			value: {
				...value,
				[fieldPath]: event.target.value,
			},
		});
	},

	makeChanger (fieldPath) {
		return this.fieldChanged.bind(this, fieldPath);
	},

	geoChanged (i, event) {
		const { value = {}, path, onChange } = this.props;
		const newVal = event.target.value;
		const geo = [
			i === 0 ? newVal : value.geo ? value.geo[0] : '',
			i === 1 ? newVal : value.geo ? value.geo[1] : '',
		];
		onChange({
			path,
			value: {
				...value,
				geo,
			},
		});
	},

	makeGeoChanger (fieldPath) {
		return this.geoChanged.bind(this, fieldPath);
	},

	formatValue () {
		const { value = {} } = this.props;
		return _.compact([
			value.number,
			value.name,
			value.street1,
			value.street2,
			value.suburb,
			value.state,
			value.postcode,
			value.country,
		]).join(', ');
	},

	renderValue () {
		return <FormInput noedit>{this.formatValue() || ''}</FormInput>;
	},

	renderField (fieldPath, label, collapse, autoFocus) {
		if (this.state.collapsedFields[fieldPath]) {
			return null;
		}
		const { value = {}, path } = this.props;
		return (
			<NestedFormField label={label} data-field-location-path={path + '.' + fieldPath}>
				<FormInput
					autoFocus={autoFocus}
					name={this.getInputName(path + '.' + fieldPath)}
					onChange={this.makeChanger(fieldPath)}
					placeholder={label}
					value={value[fieldPath] || ''}
				/>
			</NestedFormField>
		);
	},

	renderSuburbState () {
		const { value = {}, path } = this.props;
		return (
			<NestedFormField label="Suburb / State" data-field-location-path={path + '.suburb_state'}>
				<Grid.Row gutter={10}>
					<Grid.Col small="two-thirds" data-field-location-path={path + '.suburb'}>
						<FormInput
							name={this.getInputName(path + '.suburb')}
							onChange={this.makeChanger('suburb')}
							placeholder="Suburb"
							value={value.suburb || ''}
						/>
					</Grid.Col>
					<Grid.Col small="one-third" data-field-location-path={path + '.state'}>
						<FormInput
							name={this.getInputName(path + '.state')}
							onChange={this.makeChanger('state')}
							placeholder="State"
							value={value.state || ''}
						/>
					</Grid.Col>
				</Grid.Row>
			</NestedFormField>
		);
	},

	renderPostcodeCountry () {
		const { value = {}, path } = this.props;
		return (
			<NestedFormField label="Postcode / Country" data-field-location-path={path + '.postcode_country'}>
				<Grid.Row gutter={10}>
					<Grid.Col small="one-third" data-field-location-path={path + '.postcode'}>
						<FormInput
							name={this.getInputName(path + '.postcode')}
							onChange={this.makeChanger('postcode')}
							placeholder="Post Code"
							value={value.postcode || ''}
						/>
					</Grid.Col>
					<Grid.Col small="two-thirds" data-field-location-path={path + '.country'}>
						<FormInput
							name={this.getInputName(path + '.country')}
							onChange={this.makeChanger('country')}
							placeholder="Country"
							value={value.country || ''}
						/>
					</Grid.Col>
				</Grid.Row>
			</NestedFormField>
		);
	},

	handleMapLoad (map) {
		this.map = map;
	},

	// Remove marker
	handleMarkerRightClick () {
		const { value = {}, path, onChange } = this.props;
		const geo = ['', ''];
		onChange({
			path,
			value: {
				...value,
				geo,
			},
		});
	},

	handleMapClick (event) {
		const { value = {}, path, onChange } = this.props;
		const lng = event.latLng.lng();
		const lat = event.latLng.lat();
		const geo = [
			lng || (value.geo ? value.geo[0] : 0.0),
			lat || (value.geo ? value.geo[1] : 0.0),
		];
		onChange({
			path,
			value: {
				...value,
				geo,
			},
		});
	},

	renderMap () {
		const { value = {}, map, height, browserApiKey, defaultCenter } = this.props;
		if (!map) return null;
		const hasLng = value && value.geo && value.geo[0];
		const hasLat = value && value.geo && value.geo[1];
		const marker = hasLng && hasLat ? {
			position: {
				lng: value.geo[0],
				lat: value.geo[1],
			},
		} : null;

		const googleMapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${browserApiKey}`;

		return (
			<FormField offsetAbsentLabel>
				<AsyncGoogleMap
					googleMapURL={googleMapURL}
					defaultCenter={marker ? marker.position : defaultCenter}
					loadingElement={
						<div style={{ height }} />
					}
					containerElement={
						<div style={{ height }} />
					}
					mapElement={
						<div style={{ height }} />
					}
					marker={marker}
					onMarkerRightClick={this.handleMarkerRightClick}
					onMapLoad={this.handleMapLoad}
					onMapClick={this.handleMapClick}
					/>
			</FormField>
		);
	},

	renderGeo () {
		if (this.state.collapsedFields.geo) {
			return null;
		}
		const { value = {}, path, paths } = this.props;
		const geo = value.geo || [];
		return (
			<NestedFormField label="Lat / Lng" data-field-location-path={path + '.geo'}>
				<Grid.Row gutter={10}>
					<Grid.Col small="one-half" data-field-location-path="latitude">
						<FormInput
							name={this.getInputName(paths.geo + '[1]')}
							onChange={this.makeGeoChanger(1)}
							placeholder="Latitude"
							value={geo[1] || ''}
						/>
					</Grid.Col>
					<Grid.Col small="one-half" data-field-location-path="longitude">
						<FormInput
							name={this.getInputName(paths.geo + '[0]')}
							onChange={this.makeGeoChanger(0)}
							placeholder="Longitude"
							value={geo[0] || ''}
						/>
					</Grid.Col>
				</Grid.Row>
			</NestedFormField>
		);
	},

	updateGoogleOption (key, e) {
		var newState = {};
		newState[key] = e.target.checked;
		this.setState(newState);
	},

	makeGoogler (key) {
		return this.updateGoogleOption.bind(this, key);
	},


	renderGoogleOptions () {
		const { paths, enableMapsAPI } = this.props;
		if (!enableMapsAPI) return null;
		var replace = this.state.improve ? (
			<LabelledControl
				checked={this.state.overwrite}
				label="Replace existing data"
				name={this.getInputName(paths.overwrite)}
				onChange={this.makeGoogler('overwrite')}
				type="checkbox"
			/>
		) : null;
		return (
			<FormField offsetAbsentLabel>
				<LabelledControl
					checked={this.state.improve}
					label="Autodetect and improve location on save"
					name={this.getInputName(paths.improve)}
					onChange={this.makeGoogler('improve')}
					title="When checked, this will attempt to fill missing fields. It will also get the lat/long"
					type="checkbox"
				/>
				{replace}
			</FormField>
		);
	},

	renderNote () {
		const { note } = this.props;
		if (!note) return null;
		return (
			<FormField offsetAbsentLabel>
				<FormNote note={note} />
			</FormField>
		);
	},

	renderUI () {

		if (!this.shouldRenderField()) {
			return (
				<FormField label={this.props.label}>{this.renderValue()}</FormField>
			);
		}

		/* eslint-disable no-script-url */
		var showMore = !_.isEmpty(this.state.collapsedFields)
			? <CollapsedFieldLabel onClick={this.uncollapseFields}>(show more fields)</CollapsedFieldLabel>
			: null;
		/* eslint-enable */

		const { label, path } = this.props;
		return (
			<div data-field-name={path} data-field-type="location">
				<FormField label={label} htmlFor={path}>
					{showMore}
				</FormField>
				{this.renderField('number', 'PO Box / Shop', true, true)}
				{this.renderField('name', 'Building Name', true)}
				{this.renderField('street1', 'Street Address')}
				{this.renderField('street2', 'Street Address 2', true)}
				{this.renderSuburbState()}
				{this.renderPostcodeCountry()}
				{this.renderGeo()}
				{this.renderMap()}
				{this.renderGoogleOptions()}
				{this.renderNote()}
			</div>
		);
	},

});
