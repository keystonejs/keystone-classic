import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import Fields from '../fields';
import { plural } from '../utils';
import { BlankState, Button, Form, Modal } from 'elemental';

var UpdateForm = React.createClass({
	displayName: 'UpdateForm',
	propTypes: {
		isOpen: React.PropTypes.bool,
		itemIds: React.PropTypes.array,
		list: React.PropTypes.object,
		onCancel: React.PropTypes.func,
	},
	getDefaultProps () {
		return {
			isOpen: false,
		};
	},
	getInitialState () {
		return {
			fields: [],
		};
	},
	componentDidUpdate () {
		if (this.refs.focusTarget) {
			this.refs.focusTarget.focus();
		}
	},
	componentDidMount () {
		if (this.refs.focusTarget) {
			this.refs.focusTarget.focus();
		}
	},
	getOptions () {
		let { fields } = this.props.list;
		return Object.keys(fields).map(key => ({ value: fields[key].path, label: fields[key].label }));
	},
	getFieldProps (field) {
		var props = Object.assign({}, field);
		props.value = this.state.fields[field.path];
		props.values = this.state.fields;
		props.onChange = this.handleChange;
		props.mode = 'create';
		props.key = field.path;
		return props;
	},
	updateOptions (fields) {
		this.setState({
			fields: fields,
		}, () => {
			ReactDOM.findDOMNode(this.refs.focusTarget).focus();
		});
	},
	handleChange (value) {
		console.log('handleChange:', value);
	},
	handleClose () {
		this.setState({
			fields: [],
		});
		this.props.onCancel();
	},

	renderFields () {
		let { list } = this.props;
		let { fields } = this.state;
		let formFields = [];
		let focusRef;

		fields.forEach((fieldOption) => {
			let field = list.fields[fieldOption.value];

			if ('function' !== typeof Fields[field.type]) {
				formFields.push(React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path }));
				return;
			}
			var fieldProps = this.getFieldProps(field);
			if (!focusRef) {
				fieldProps.ref = focusRef = 'focusTarget';
			}
			formFields.push(React.createElement(Fields[field.type], fieldProps));
		});

		let fieldsUI = formFields.length ? formFields : (
			<BlankState style={{ padding: '3em 2em' }}>
				<BlankState.Heading style={{ fontSize: '1.5em' }}>Choose a field above to begin</BlankState.Heading>
			</BlankState>
		);

		return (
			<div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', marginTop: 20, paddingTop: 20,  }}>
				{fieldsUI}
			</div>
		);
	},
	renderForm () {
		let { itemIds, list } = this.props;
		let itemCount = plural(itemIds, ('* ' + list.singular), ('* ' + list.plural));
		let formAction = `${Keystone.adminPath}/${list.path}`;

		return (
			<Form type="horizontal" encType="multipart/form-data" method="post" action={formAction}>
				<input type="hidden" name="action" value="update" />
				<input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
				<Modal.Header text={'Update ' + itemCount} onClose={this.handleClose} showCloseButton />
				<Modal.Body>
					<Select ref="initialFocusTarget" onChange={this.updateOptions} options={this.getOptions()} value={this.state.fields} key="field-select" multi />
					{this.renderFields()}
				</Modal.Body>
				<Modal.Footer>
					<Button type="primary" submit>Update</Button>
					<Button type="link-cancel" onClick={this.handleClose}>Cancel</Button>
				</Modal.Footer>
			</Form>
		);
	},
	render () {
		return (
			<Modal isOpen={this.props.isOpen} onCancel={this.handleClose} backdropClosesModal>
				{this.renderForm()}
			</Modal>
		);
	}
});

module.exports = UpdateForm;
