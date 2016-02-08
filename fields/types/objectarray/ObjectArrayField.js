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

		return {
			values: this.props.value,
			list: subList
		};
	},

	componentWillReceiveProps (nextProps) {
		this.setState({ values: nextProps.value });
	},

	renderItems () {
		return this.state.values.map((val) => {
			return (
				<FieldGroup key={val._id} parentPath={this.props.path} data={val} list={this.state.list} onRemove={ this.removeItem } />
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
	renderField () {
		// var props = Object.assign(this.props.inputProps, {
		// 	autoComplete: 'off',
		// 	name: this.props.path,
		// 	onChange: this.valueChanged,
		// 	ref: 'focusTarget',
		// 	value: this.props.value
		// });

		return (
			<div>
				{ this.renderItems() }
				<Button ref="addObjectItemButton" onClick={this.addItem}>Add item</Button>
			</div>
		);
	}
});
