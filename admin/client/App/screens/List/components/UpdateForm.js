import React from 'react';
import Select from 'react-select';
import { findDOMNode } from 'react-dom';
import assign from 'object-assign';
import { Fields } from 'FieldTypes';
import InvalidFieldType from '../../../shared/InvalidFieldType';
import { plural } from '../../../../utils/string';
import { BlankState, Button, Form, Modal } from '../../../elemental';

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
	componentDidMount () {
		this.doFocus();
	},
	componentDidUpdate () {
		this.doFocus();
	},
	doFocus () {
		if (this.refs.focusTarget) {
			findDOMNode(this.refs.focusTarget).focus();
		}
	},
	getOptions () {
		const { fields } = this.props.list;
		return Object.keys(fields).map(key => ({ value: fields[key].path, label: fields[key].label }));
	},
	getFieldProps (field) {
		var props = assign({}, field);
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
		}, this.doFocus);
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
		const { list } = this.props;
		const { fields } = this.state;
		const formFields = [];
		let focusRef;

		fields.forEach((fieldOption) => {
			const field = list.fields[fieldOption.value];

			if (typeof Fields[field.type] !== 'function') {
				formFields.push(React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path }));
				return;
			}
			var fieldProps = this.getFieldProps(field);
			if (!focusRef) {
				fieldProps.ref = focusRef = 'focusTarget';
			}
			formFields.push(React.createElement(Fields[field.type], fieldProps));
		});

		const fieldsUI = formFields.length ? formFields : (
			<BlankState
				heading="Choose a field above to begin"
				style={{ padding: '3em 2em' }}
			/>
		);

		return (
			<div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', marginTop: 20, paddingTop: 20 }}>
				{fieldsUI}
			</div>
		);
	},
	renderForm () {
		const { itemIds, list } = this.props;
		const itemCount = plural(itemIds, ('* ' + list.singular), ('* ' + list.plural));
		const formAction = `${Keystone.adminPath}/${list.path}`;

		return (
			<Form layout="horizontal" action={formAction} noValidate="true">
				<Modal.Header
					onClose={this.handleClose}
					showCloseButton
					text={'Update ' + itemCount}
				/>
				<Modal.Body>
					<Select
						key="field-select"
						multi
						onChange={this.updateOptions}
						options={this.getOptions()}
						ref="initialFocusTarget"
						value={this.state.fields}
					/>
					{this.renderFields()}
				</Modal.Body>
				<Modal.Footer>
					<Button color="primary" submit>Update</Button>
					<Button color="cancel" variant="link" onClick={this.handleClose}>Cancel</Button>
				</Modal.Footer>
			</Form>
		);
	},
	render () {
		return (
			<Modal.Dialog isOpen={this.props.isOpen} onClose={this.handleClose} backdropClosesModal>
				{this.renderForm()}
			</Modal.Dialog>
		);
	},
});

module.exports = UpdateForm;
