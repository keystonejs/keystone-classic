const React = require('react');
const Select = require ('react-select');
const Fields = require('../fields');
const { plural } = require('../utils');
const { Alert, Button, Form, Modal } = require('elemental');

function pluck(arr, key) {
	return arr.map(obj => obj[key]);
}

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
			isOpen: false
		};
	},
	getInitialState () {
		return {
			fields: []
		};
	},
	componentDidUpdate (prevProps, prevState) {
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
	updateOptions (simpleValue, expandedValues) {
		this.setState({
			fields: expandedValues
		});
	},
	handleChange (value) {
		console.log('handleChange:', value);
	},

	renderForm () {
		let { itemIds, list } = this.props;
		let { fields } = this.state;
		let itemCount = plural(itemIds, ('* ' + list.singular), ('* ' + list.plural));
		let formAction = '/keystone/' + list.path;
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

		let form = formFields.length ? (
			<div style={{ borderTop: '1px dashed #eee', marginTop: 20, paddingTop: 20,  }}>{formFields}</div>
		) : null;

		return (
			<Form type="horizontal" encType="multipart/form-data" method="post" action={formAction}>
				<input type="hidden" name="action" value="update" />
				<input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
				<Modal.Header text={'Update ' + itemCount} onClose={this.props.onCancel} showCloseButton />
				<Modal.Body>
					<Select ref="focusTarget" onChange={this.updateOptions} options={this.getOptions()} value={this.state.fields} key="field-select" multi />
					{form}
				</Modal.Body>
				<Modal.Footer>
					<Button type="primary" submit>Update</Button>
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
	}

});

module.exports = UpdateForm;
