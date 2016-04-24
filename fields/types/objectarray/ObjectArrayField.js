import React from 'react';
import ReactDOM from 'react-dom';
import Field from '../Field';
import FieldGroup from '../../../admin/client/components/FieldGroup'
import jsonCycle from 'json-cycle';

import { Button } from 'elemental';

var lastId = 0;

module.exports = Field.create({
	displayName: 'ObjectArrayField',
	getInitialState () {
		var subList = jsonCycle.retrocycle(this.props.subList);

		var initialState = {
			values: this.props.value,
			list: subList
		};

		if (this.props.subFields) initialState.subFieldValues = this.props.subFields;
		return initialState;
	},

	componentWillReceiveProps (nextProps) {
		var nextState = {};
		if (nextProps.subFields) nextState.subFieldValues = nextProps.subFields;
		this.setState(nextState);
	},

	renderItems () {
		if (this.state.subFieldValues && this.state.subFieldValues.length == 0) return (<span>No subfields</span>);
		return this.state.subFieldValues ? this.renderFields(this.state.subFieldValues, this.state.values) : this.renderFields(this.state.values);
	},
	renderFields (fields, values) {
		return fields.map((field, index) => {
			var value = field;

			if (values) {
				value = values[index];

				if (this.props.treatAsKey) {
					var key = this.props.treatAsKey;
					value = values.filter((val) => { return val[key] == field[key] })[0] || field;
				}
			}

			var props = {
				key: field._id,
				parentPath: this.props.nested ? (this.props.nested + '.' + this.props.path + '_' + this.props._id) : this.props.path,
				data: value,
				list: this.state.list,
				onRemove:  this.removeItem,
			};

			if (this.state.subFieldValues) props.subFieldValue = field;

			return (
				<FieldGroup {...props} />
			);
		});
	},
	valueChanged (values) {
		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},
	addItem () {
		var newItem = {};

		lastId += 1;

		Object.keys(this.state.list.fields).forEach((key, i) => {
			var field = this.state.list.fields[key];

			newItem[key] = field.type.indexOf('array') == -1 ? '' : [];
			newItem._id = lastId;
		});

		var newValues = this.state.values.concat([newItem]);
		this.setState({
			values: newValues
		});
		this.valueChanged(newValues);
	},
	removeItem: function(item) {

		var newValues = this.state.values.filter((value) => {
			return value._id != item._id;
		});
		this.setState({
			values: newValues
		});
		this.valueChanged(newValues);
	},
	renderAddButton () {
		if (this.props.treatAsKey) return;
		return (
			<Button ref="addObjectItemButton" onClick={this.addItem}>Add item</Button>
		);
	},
	renderField () {
		return (
			<div>
				{ this.renderItems() }
				{ this.renderAddButton() }
			</div>
		);
	}
});
