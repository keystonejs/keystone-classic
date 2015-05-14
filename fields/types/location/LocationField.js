/**
 * TODO:
 * - Custom path support
 */

var React = require('react');
var _ = require('underscore');
var Field = require('../Field');
var Note = require('../../components/Note');

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;
var FormLabel = require('elemental').FormLabel;
var FormRow = require('elemental').FormRow;

module.exports = Field.create({
	
	displayName: 'LocationField',
	
	getInitialState: function() {
		return {
			collapsedFields: {},
			improve: false,
			overwrite: false
		};
	},
	
	componentWillMount: function() {
		
		var collapsedFields = {};
		
		_.each(['number', 'name', 'street2', 'geo'], function(i) {
			if (!this.props.value[i]) {
				collapsedFields[i] = true;
			}
		}, this);
		
		this.setState({
			collapsedFields: collapsedFields
		});
		
	},
	
	componentDidUpdate: function(prevProps, prevState) {
		if (prevState.fieldsCollapsed && !this.state.fieldsCollapsed) {
			this.refs.number.getDOMNode().focus();
		}
	},
	
	shouldCollapse: function() {
		return this.formatValue() ? false : true;
	},
	
	uncollapseFields: function() {
		this.setState({
			collapsedFields: {}
		});
	},
	
	fieldChanged: function(path, event) {
		var value = this.props.value;
		value[path] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},
	
	geoChanged: function(i, event) {
		var value = this.props.value;
		if (!value.geo) {
			value.geo = ['', ''];
		}
		value.geo[i] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},
	
	formatValue: function() {
		return _.compact([
			this.props.value.number,
			this.props.value.name,
			this.props.value.street1,
			this.props.value.street2,
			this.props.value.suburb,
			this.props.value.state,
			this.props.value.postcode,
			this.props.value.country
		]).join(', ');
	},
	
	renderValue: function() {
		return <FormInput noedit>{this.formatValue() || '(no value)'}</FormInput>;
	},
	
	renderField: function(path, label, collapse) {//eslint-disable-line no-unused-vars
		
		if (this.state.collapsedFields[path]) {
			return null;
		}
		
		return (
			<FormField label={label} className="form-field--secondary" htmlFor={this.props.path + '.' + path}>
				<FormInput name={this.props.path + '.' + path} ref={path} value={this.props.value[path]} onChange={this.fieldChanged.bind(this, path)} placeholder={label} />
			</FormField>
		);
		
	},
	
	renderSuburbState: function() {
		return (
			<FormField label="Suburb / State" className="form-field--secondary" htmlFor={this.props.path + '.suburb'}>
				<FormRow>
					<FormField width="two-thirds" className="form-field--secondary">
						<FormInput name={this.props.path + '.suburb'} ref="suburb" value={this.props.value.suburb} onChange={this.fieldChanged.bind(this, 'suburb')} placeholder="Suburb" />
					</FormField>
					<FormField width="one-third" className="form-field--secondary">
						<FormInput name={this.props.path + '.state'} ref="state" value={this.props.value.state} onChange={this.fieldChanged.bind(this, 'state')} placeholder="State" />
					</FormField>
				</FormRow>
			</FormField>
		);
	},
	
	renderPostcodeCountry: function() {
		return (
			<FormField label="Postcode / Country" className="form-field--secondary" htmlFor={this.props.path + '.postcode'}>
				<FormRow>
					<FormField width="one-third" className="form-field--secondary">
						<FormInput name={this.props.path + '.postcode'} ref="postcode" value={this.props.value.postcode} onChange={this.fieldChanged.bind(this, 'postcode')} placeholder="Post Code" />
					</FormField>
					<FormField width="two-thirds" className="form-field--secondary">
						<FormInput name={this.props.path + '.country'} ref="country" value={this.props.value.country} onChange={this.fieldChanged.bind(this, 'country')} placeholder="Country" />
					</FormField>
				</FormRow>
			</FormField>
		);
	},
	
	renderGeo: function() {
		
		if (this.state.collapsedFields.geo) {
			return null;
		}
		
		return (
			<FormField label="Lat / Lng" className="form-field--secondary" htmlFor={this.props.paths.geo}>
				<FormRow>
					<FormField width="one-half" className="form-field--secondary">
						<FormInput name={this.props.paths.geo} ref="geo1" value={this.props.value.geo ? this.props.value.geo[1] : ''} onChange={this.geoChanged.bind(this, 1)} placeholder="Latitude" />
					</FormField>
					<FormField width="one-half" className="form-field--secondary">
						<FormInput name={this.props.paths.geo} ref="geo0" value={this.props.value.geo ? this.props.value.geo[0] : ''} onChange={this.geoChanged.bind(this, 0)} placeholder="Longitude" />
					</FormField>
				</FormRow>
			</FormField>
		);
		
	},
	
	updateGoogleOption: function(key, e) {
		var newState = {};
		newState[key] = e.target.checked;
		this.setState(newState);
	},
	
	renderGoogleOptions: function() {
		if (!this.props.enableMapsAPI) return null;
		var replace = this.state.improve ? (
			<label className="checkbox">
				<input type="checkbox" name={this.props.paths.overwrite} id={this.props.paths.overwrite} value="true" onChange={this.updateGoogleOption.bind(this, 'overwrite')} checked={this.state.overwrite} />
				Replace existing data
			</label>
		) : null;
		return (
			<FormField offsetAbsentLabel>
				<label className="checkbox mr-1" title="When checked, this will attempt to fill missing fields. It will also get the lat/long">
					<input type="checkbox" name={this.props.paths.improve} id={this.props.paths.improve} value="true" onChange={this.updateGoogleOption.bind(this, 'improve')} checked={this.state.improve} />
					Autodetect and improve location on save
				</label>
				{replace}
			</FormField>
		);
	},
	
	renderUI: function() {
		
		if (!this.shouldRenderField()) {
			return (
				<FormField label={this.props.label} className="form-field--secondary">
					<div className="noedit">
						{this.renderValue()}
					</div>
				</FormField>
			);
		}
		
		/* eslint-disable no-script-url */
		var showMore = !_.isEmpty(this.state.collapsedFields)
			? <Button type="link" className="field-reveal-trigger" onClick={this.uncollapseFields}>(show more fields)</Button>
			: null;
		/* eslint-enable */
		
		return (
			<div>
				<FormField label={this.props.label}>
					{showMore}
				</FormField>
				{this.renderField('number', 'PO Box / Shop', true)}
				{this.renderField('name', 'Building Name', true)}
				{this.renderField('street1', 'Street Address')}
				{this.renderField('street2', 'Street Address 2', true)}
				{this.renderSuburbState()}
				{this.renderPostcodeCountry()}
				{this.renderGeo()}
				{this.renderGoogleOptions()}
				<Note note={this.props.note} />
			</div>
		);
		
	}
	
});
