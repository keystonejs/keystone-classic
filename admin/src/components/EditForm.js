var _ = require('underscore');
var moment = require('moment');
var React = require('react');
var Fields = require('../fields');
var FormHeading = require('./FormHeading');
var Toolbar = require('./Toolbar');
var InvalidFieldType = require('./InvalidFieldType');

var Button = require('elemental').Button;
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
	
	renderNameField: function() {
		
		var nameField = this.props.list.nameField,
			nameIsEditable = this.props.list.nameIsEditable;
		
		function wrapNameField(field) {
			return (
				<div className="item-details__name-field">
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
				<h2 className="form-heading name-value">{this.props.data.name || '(no name)'}</h2>
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
			<Toolbar className="item-details__footer">
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
					<div className="item-details__meta-item">
						<span className="item-details__meta-label">Created</span>
						<span className="item-details__meta-info">{moment(data.createdAt).format('Do MMM YY h:mm:ssa')}</span>
					</div>
				);
			}
		}
		
		if (this.props.list.tracking.createdBy) {
			data.createdBy = this.props.data.fields[this.props.list.tracking.createdBy];
			if (data.createdBy) {
				label = data.createdAt ? 'by' : 'Created by';
				// todo: harden logic around user name
				elements.createdBy = (
					<div className="item-details__meta-item">
						<span className="item-details__meta-label">{label}</span>
						<span className="item-details__meta-info">{data.createdBy.name.first} {data.createdBy.name.last}</span>
					</div>
				);
			}
		}
		
		if (this.props.list.tracking.updatedAt) {
			data.updatedAt = this.props.data.fields[this.props.list.tracking.updatedAt];
			if (data.updatedAt && (!data.createdAt || data.createdAt !== data.updatedAt)) {
				elements.updatedAt = (
					<div className="item-details__meta-item">
						<span className="item-details__meta-label">Updated</span>
						<span className="item-details__meta-info">{moment(data.updatedAt).format('Do MMM YY h:mm:ssa')}</span>
					</div>
				);
			}
		}
		
		if (this.props.list.tracking.updatedBy) {
			data.updatedBy = this.props.data.fields[this.props.list.tracking.updatedBy];
			if (data.updatedBy && (!data.createdBy || data.createdBy.id !== data.updatedBy.id || elements.updatedAt)) {
				label = data.updatedAt ? 'by' : 'Created by';
				elements.updatedBy = (
					<div className="item-details__meta-item">
						<span className="item-details__meta-label">{label}</span>
						<span className="item-details__meta-info">{data.updatedBy.name.first} {data.updatedBy.name.last}</span>
					</div>
				);
			}
		}
		
		return Object.keys(elements).length ? <div className="item-details__meta">{elements}</div> : null;
		
	},
	
	render: function() {
		
		return (
			<div className="row">
				<div className="[ col-md-4 col-lg-3 ] [ col-md-push-8 col-lg-push-9 ]">
					{this.renderTrackingMeta()}
				</div>
				<div className="[ col-md-8 col-lg-9 ] [ col-md-pull-4 col-lg-pull-3 ]">
					<form method="post" encType="multipart/form-data" className="item-details horizontal-form">
						<input type="hidden" name="action" value="updateItem" />
						<input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
						{this.renderNameField()}
						{this.renderFormElements()}
						{this.renderToolbar()}
					</form>
				</div>
			</div>
		);
	}
	
});

module.exports = EditForm;
