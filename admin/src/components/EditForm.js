var _ = require('underscore');
var moment = require('moment');
var React = require('react');
var Fields = require('../fields');
var FormHeading = require('./FormHeading');
var AltText = require('./AltText');
var Toolbar = require('./Toolbar');
var InvalidFieldType = require('./InvalidFieldType');

var Button = require('elemental').Button;
var FormInput = require('elemental').FormInput;
var FormField = require('elemental').FormField;

var EditForm = React.createClass({
	
	displayName: 'EditForm',
	
	getInitialState: function() {
		return {
			values: _.clone(this.props.data.fields)
		};
	},
	
	getFieldProps: function(field) {
		var props = _.clone(field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'edit';
		return props;
	},
	
	handleChange: function(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	},
	
	renderKeyOrId: function() {
		var className = 'EditForm__key-or-id';
		var list = this.props.list;

		if (list.nameField && list.autokey && this.props.data[list.autokey.path]) {
			return (
				<AltText
					normal={list.autokey.path + ': ' + this.props.data[list.autokey.path]}
					modified={'ID: ' + String(this.props.data.id)}
					component="div"
					title="Press <alt> to reveal the ID"
					className={className} />
			);
		} else if (list.autokey && this.props.data[list.autokey.path]) {
			return (
				<div className={className}>{list.autokey.path}: {this.props.data[list.autokey.path]}</div>
			);
		} else if (list.nameField) {
			return (
				<div className={className}>id: {this.props.data.id}</div>
			);
		}
	},
	
	renderNameField: function() {
		
		var nameField = this.props.list.nameField,
			nameIsEditable = this.props.list.nameIsEditable;
		
		function wrapNameField(field) {
			return (
				<div className="EditForm__name-field">
					{field}
				</div>
			);
		}
		
		if (nameIsEditable) {
			
			var nameFieldProps = this.getFieldProps(nameField);

			nameFieldProps.label = false;
			nameFieldProps.size = 'full';
			nameFieldProps.inputProps = {
				className: 'item-name-field',
				placeholder: nameField.label,
				size: 'lg'
			};
			
			return wrapNameField(
				React.createElement(Fields[nameField.type], nameFieldProps)
			);
			
		} else {
			return wrapNameField(
				<h2>{this.props.data.name || '(no name)'}</h2>
			);
		}
	},
	
	renderFormElements: function() {
		
		var elements = {},
			headings = 0;
		
		_.each(this.props.list.uiElements, function(el) {
			
			if (el.type === 'heading') {
				
				headings++;
				el.options.values = this.state.values;
				elements['h-' + headings] = React.createElement(FormHeading, el);
				
			} else if (el.type === 'field') {
				
				var field = this.props.list.fields[el.field],
					props = this.getFieldProps(field);


				if ('function' !== typeof Fields[field.type]) {
					elements[field.path] = React.createElement(InvalidFieldType, { type: field.type, path: field.path });
					return;
				}

				if (props.dependsOn) {
					props.currentDependencies = {};
					Object.keys(props.dependsOn).forEach(function (dep) {
						props.currentDependencies[dep] = this.state.values[dep];
					}, this);
				}

				elements[field.path] = React.createElement(Fields[field.type], props);
				
			}
			
		}, this);
		
		return elements;
		
	},
	
	renderToolbar: function() {
		
		var toolbar = {};
		
		if (!this.props.list.noedit) {
			toolbar.save = <Button type="primary" submit>Save</Button>;
			// TODO: Confirm: Use React & Modal
			toolbar.reset = <Button href={'/keystone/' + this.props.list.path + '/' + this.props.data.id} type="link-cancel" data-confirm="Are you sure you want to reset your changes?">reset changes</Button>;
		}
		
		if (!this.props.list.noedit && !this.props.list.nodelete) {
			// TODO: Confirm: Use React & Modal
			toolbar.del = <Button href={'/keystone/' + this.props.list.path + '?delete=' + this.props.data.id + Keystone.csrf.query} type="link-delete" className="pull-right" data-confirm={'Are you sure you want to delete this?' + this.props.list.singular.toLowerCase()}>delete {this.props.list.singular.toLowerCase()}</Button>;
		}
		
		return (
			<Toolbar className="EditForm__footer">
				{toolbar}
			</Toolbar>
		);
		
	},
	
	renderTrackingMeta: function() {
		
		if (!this.props.list.tracking) return null;
		
		var elements = {},
			data = {},
			label;
		
		if (this.props.list.tracking.createdAt) {
			data.createdAt = this.props.data.fields[this.props.list.tracking.createdAt];
			if (data.createdAt) {
				elements.createdAt = (
					<FormField label="Created on">
						<FormInput noedit title={moment(data.createdAt).format('DD/MM/YYYY h:mm:ssa')}>{moment(data.createdAt).format('Do MMM YYYY')}</FormInput>
					</FormField>
				);
			}
		}
		
		if (this.props.list.tracking.createdBy) {
			data.createdBy = this.props.data.fields[this.props.list.tracking.createdBy];
			var label = this.props.list.tracking.createdAt ? 'by' : 'Created by';
			if (data.createdBy) {
				// todo: harden logic around user name
				elements.createdBy = (
					<FormField label="Created by">
						<FormInput noedit>{data.createdBy.name.first} {data.createdBy.name.last}</FormInput>
					</FormField>
				);
			}
		}
		
		if (this.props.list.tracking.updatedAt) {
			data.updatedAt = this.props.data.fields[this.props.list.tracking.updatedAt];
			if (data.updatedAt && (!data.createdAt || data.createdAt !== data.updatedAt)) {
				elements.updatedAt = (
					<FormField label="Updated on">
						<FormInput noedit title={moment(data.updatedAt).format('DD/MM/YYYY h:mm:ssa')}>{moment(data.updatedAt).format('Do MMM YYYY')}</FormInput>
					</FormField>
				);
			}
		}
		
		if (this.props.list.tracking.updatedBy) {
			data.updatedBy = this.props.data.fields[this.props.list.tracking.updatedBy];
			var label = this.props.list.tracking.createdAt ? 'by' : 'Updated by';
			if (data.updatedBy && (!data.createdBy || data.createdBy.id !== data.updatedBy.id || elements.updatedAt)) {
				elements.updatedBy = (
					<FormField label="Updated by">
						<FormInput noedit>{data.updatedBy.name.first} {data.updatedBy.name.last}</FormInput>
					</FormField>
				);
			}
		}
		
		return Object.keys(elements).length ? (
			<div className="EditForm__meta">
				<h3 className="form-heading">Meta</h3>
				{elements}
			</div>
		) : null;
		
	},
	
	render: function() {
		
		return (
			<div className="row">
				<div className="col-md-3 col-md-push-9">
				</div>
				<div className="col-md-9 col-md-pull-3">
					<form method="post" encType="multipart/form-data" className="EditForm horizontal-form">
						<input type="hidden" name="action" value="updateItem" />
						<input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
						{this.renderNameField()}
						{this.renderKeyOrId()}
						{this.renderFormElements()}
						{this.renderTrackingMeta()}
						{this.renderToolbar()}
					</form>
				</div>
			</div>
		);
	}
	
});

module.exports = EditForm;
