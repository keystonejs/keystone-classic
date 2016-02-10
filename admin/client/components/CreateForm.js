import React from 'react';
import Fields from '../fields';
import InvalidFieldType from './InvalidFieldType';
import { Alert, Button, Form, Modal } from 'elemental';
import xhr from 'xhr';

var CreateForm = React.createClass({
	displayName: 'CreateForm',
	propTypes: {
		err: React.PropTypes.object,
		isOpen: React.PropTypes.bool,
		list: React.PropTypes.object,
		onCancel: React.PropTypes.func,
		onCreate: React.PropTypes.func,
		values: React.PropTypes.object,
	},
	getDefaultProps () {
		return {
			err: null,
			values: {},
			isOpen: false,
		};
	},
	getInitialState () {
		var values = Object.assign({}, this.props.values);

		Object.keys(this.props.list.fields).forEach(key => {
			var field = this.props.list.fields[key];

			if (!values[field.path]) {
				values[field.path] = field.defaultValue;
			}
		});
		return {
			values: values,
			err: this.props.err,
		};
	},
	componentDidMount () {
		if (this.refs.focusTarget) {
			this.refs.focusTarget.focus();
		}
	},
	componentDidUpdate (prevProps) {
		if (this.props.isOpen !== prevProps.isOpen) {
			// focus the focusTarget after the "open modal" CSS animation has started
			setTimeout(() => this.refs.focusTarget && this.refs.focusTarget.focus(), 0);
		}
	},
	handleChange (event) {
		var values = Object.assign({}, this.state.values);
		values[event.path] = event.value;
		this.setState({
			values: values,
		});
	},
	getFieldProps (field) {
		var props = Object.assign({}, field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'create';
		props.key = field.path;
		return props;
	},

	submitForm (event) {
		// If there is an onCreate function,
		// 	create new item using async create api instead
		// 	of using a POST request to the list endpoint.
		if (this.props.onCreate) {
			event.preventDefault();
			let createForm = this.refs.createForm.getDOMNode();
			let formData = new FormData(createForm);
			this.props.list.createItem(formData, (err, data) => {
				if (data) {
					this.props.onCreate(data);
					this.setState({
						values: {},
						err: null,
					}); // Clear form
				} else {
					this.setState({
						err: err.detail,
					});
				}
			});
		}
	},

	renderAlerts () {
		if (!this.state.err || !this.state.err.errors) return;

		let errors = this.state.err.errors;
		var alertContent;
		var errorCount = Object.keys(errors).length;

		var messages = Object.keys(errors).map((path) => {
			return errorCount > 1 ? <li key={path}>{errors[path].message}</li> : <div key={path}>{errors[path].message}</div>;
		});

		if (errorCount > 1) {
			alertContent = (
				<div>
					<h4>There were {errorCount} errors creating the new {this.props.list.singular}:</h4>
					<ul>{messages}</ul>
				</div>
			);
		} else {
			alertContent = messages;
		}

		return <Alert type="danger">{alertContent}</Alert>;
	},
	renderForm () {
		if (!this.props.isOpen) return;

		var form = [];
		var list = this.props.list;
		var formAction = `${Keystone.adminPath}/${list.path}`;
		var nameField = this.props.list.nameField;
		var focusRef;

		if (list.nameIsInitial) {
			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.ref = focusRef = 'focusTarget';
			if (nameField.type === 'text') {
				nameFieldProps.className = 'item-name-field';
				nameFieldProps.placeholder = nameField.label;
				nameFieldProps.label = false;
			}
			form.push(React.createElement(Fields[nameField.type], nameFieldProps));
		}

		Object.keys(list.initialFields).forEach(key => {
			var field = list.fields[list.initialFields[key]];
			if (typeof Fields[field.type] !== 'function') {
				form.push(React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path }));
				return;
			}
			var fieldProps = this.getFieldProps(field);
			if (!focusRef) {
				fieldProps.ref = focusRef = 'focusTarget';
			}
			form.push(React.createElement(Fields[field.type], fieldProps));
		});

		return (
			<Form ref="createForm" type="horizontal" encType="multipart/form-data" method="post" action={formAction} onSubmit={this.submitForm} className="create-form">
				<input type="hidden" name="action" value="create" />
				<input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
				<Modal.Header text={'Create a new ' + list.singular} onClose={this.props.onCancel} showCloseButton />
				<Modal.Body>
					{this.renderAlerts()}
					{form}
				</Modal.Body>
				<Modal.Footer>
					<Button type="success" submit>Create</Button>
					<Button type="link-cancel" onClick={this.props.onCancel}>Cancel</Button>
				</Modal.Footer>
			</Form>
		);
	},
	render () {
		return (
			<Modal isOpen={this.props.isOpen} onCancel={this.props.onCancel} backdropClosesModal>
				{this.renderForm()}
			</Modal>
		);
	},
});

module.exports = CreateForm;
