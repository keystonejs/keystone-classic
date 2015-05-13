var _ = require('underscore');
var React = require('react');
var Fields = require('../fields');
var InvalidFieldType = require('./InvalidFieldType');

var Alert = require('elemental').Alert;
var Button = require('elemental').Button;
var Modal  = require('elemental').Modal;

var Form = React.createClass({
	
	displayName: 'CreateForm',
	
	getDefaultProps: function() {
		return {
			err: null,
			values: {},
			animate: false
		};
	},
	
	getInitialState: function() {
		
		var values = this.props.values;
		
		_.each(this.props.list.fields, function(field) {
			if (!values[field.path]) {
				values[field.path] = field.defaultValue;
			}
		});
		
		return {
			values: values
		};
		
	},
	
	handleChange: function(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	},

	componentWillMount: function() {
		this._bodyStyleOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	},
	
	componentDidMount: function() {
		if (this.refs.focusTarget) {
			this.refs.focusTarget.focus();
		}
	},

	componentWillUnmount: function() {
		document.body.style.overflow = this._bodyStyleOverflow;
	},
	
	getFieldProps: function(field) {
		var props = _.clone(field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'create';
		return props;
	},
	
	render: function() {
		
		var errors = null,
			form = {},
			list = this.props.list,
			formAction = '/keystone/' + list.path,
			nameField = this.props.list.nameField,
			focusRef;
		
		var modalClass = 'modal modal-md' + (this.props.animate ? ' animate' : '');
		
		if (this.props.err && this.props.err.errors) {
			var msgs = {};
			_.each(this.props.err.errors, function(err, path) {
				msgs[path] = <li>{err.message}</li>;
			});
			errors = (
				<Alert type="danger">
					<h4>There was an error creating the new {list.singular}:</h4>
					<ul>{msgs}</ul>
				</Alert>
			);
		}
		
		if (list.nameIsInitial) {
			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.ref = focusRef = 'focusTarget';
			if (nameField.type === 'text') {
				nameFieldProps.className = 'item-name-field';
				nameFieldProps.placeholder = nameField.label;
				nameFieldProps.label = false;
			}
			form[nameField.path] = React.createElement(Fields[nameField.type], nameFieldProps);
		}
		
		_.each(list.initialFields, function(path) {
				
			var field = list.fields[path];
			
			if ('function' !== typeof Fields[field.type]) {
				form[field.path] = React.createElement(InvalidFieldType, { type: field.type, path: field.path });
				return;
			}
			
			var fieldProps = this.getFieldProps(field);
			
			if (!focusRef) {
				fieldProps.ref = focusRef = 'focusTarget';
			}
			
			form[field.path] = React.createElement(Fields[field.type], fieldProps);
			
		}, this);
		
		return (
			<Modal isOpen onChange={this.props.onCancel} headerTitle={'Create a new ' + list.singular} headerHasCloseButton backdropClosesModal>
				<form encType="multipart/form-data" method="post" action={formAction}>
					<input type="hidden" name="action" value="create" />
					<input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
					<div className="Modal-body">
						{errors}
						{form}
					</div>
					<div className="Modal-footer">
						<Button type="success" submit>Create</Button>
						<Button type="link-cancel" onClick={this.props.onCancel}>cancel</Button>
					</div>
				</form>
			</Modal>
		);
	}
	
});

module.exports = Form;
